export type ActionType = 'create' | 'remix' | 'share' | 'convert';

export interface ViralAction {
  id: string;
  timestamp: number;
  actionType: ActionType;
  actorName: string;
  actorWalletAddress?: string;
  upstreamActionId?: string; // Reference to parent action
  contentId: string;
  reward?: string; // USDC amount earned
}

export interface ViralChain {
  contentId: string;
  creatorName: string;
  actions: ViralAction[];
}

interface RewardSplit {
  recipient: string;
  recipientAddress: string;
  amount: string;
  role: string;
}

class ViralTrackingService {
  private actions: Map<string, ViralAction> = new Map();
  private chains: Map<string, ViralChain> = new Map();
  private conversionValue = 20.00; // $20 USDC per conversion
  
  // Reward distribution: 40% creator, decay for upstream, bonus for converter
  private creatorShare = 0.40;
  private decayFactor = 0.50; // Each hop gets 50% of previous
  private converterBonus = 0.10;

  createContent(creatorName: string, walletAddress?: string): ViralAction {
    const contentId = `content-${Date.now()}`;
    const action: ViralAction = {
      id: `action-${Date.now()}-create`,
      timestamp: Date.now(),
      actionType: 'create',
      actorName: creatorName,
      actorWalletAddress: walletAddress,
      contentId,
    };
    
    this.actions.set(action.id, action);
    this.chains.set(contentId, {
      contentId,
      creatorName,
      actions: [action],
    });
    
    console.log(`📝 Content created by ${creatorName}: ${contentId}`);
    return action;
  }

  recordAction(
    actionType: ActionType,
    actorName: string,
    upstreamActionId: string,
    walletAddress?: string
  ): ViralAction | null {
    const upstreamAction = this.actions.get(upstreamActionId);
    if (!upstreamAction) {
      console.error(`Upstream action not found: ${upstreamActionId}`);
      return null;
    }

    const action: ViralAction = {
      id: `action-${Date.now()}-${actionType}`,
      timestamp: Date.now(),
      actionType,
      actorName,
      actorWalletAddress: walletAddress,
      upstreamActionId,
      contentId: upstreamAction.contentId,
    };

    this.actions.set(action.id, action);
    
    const chain = this.chains.get(upstreamAction.contentId);
    if (chain) {
      chain.actions.push(action);
    }

    console.log(`🔗 ${actionType} by ${actorName} (upstream: ${upstreamAction.actorName})`);
    return action;
  }

  calculateRewardSplits(conversionActionId: string): RewardSplit[] {
    const conversionAction = this.actions.get(conversionActionId);
    if (!conversionAction || conversionAction.actionType !== 'convert') {
      console.error('Invalid conversion action');
      return [];
    }

    const chain = this.chains.get(conversionAction.contentId);
    if (!chain) return [];

    // Build the path from conversion back to creator
    const path: ViralAction[] = [];
    let current: ViralAction | undefined = conversionAction;
    
    while (current) {
      path.unshift(current);
      current = current.upstreamActionId 
        ? this.actions.get(current.upstreamActionId) 
        : undefined;
    }

    const splits: RewardSplit[] = [];
    let remainingPool = this.conversionValue;

    // Creator always gets 40%
    const creatorAction = path[0];
    const creatorAmount = this.conversionValue * this.creatorShare;
    splits.push({
      recipient: creatorAction.actorName,
      recipientAddress: creatorAction.actorWalletAddress || '',
      amount: creatorAmount.toFixed(2),
      role: 'Creator',
    });
    remainingPool -= creatorAmount;

    // Converter bonus (10%)
    const converterAmount = this.conversionValue * this.converterBonus;
    splits.push({
      recipient: conversionAction.actorName,
      recipientAddress: conversionAction.actorWalletAddress || '',
      amount: converterAmount.toFixed(2),
      role: 'Converter',
    });
    remainingPool -= converterAmount;

    // Distribute remaining 50% with decay to intermediaries
    // Closest to converter gets most, decay as we go back toward creator
    const intermediaries = path.slice(1, -1); // Exclude creator and converter
    if (intermediaries.length > 0) {
      // Calculate total decay weights for normalization
      // Weight[i] = 0.5^(distance from converter), where i=0 is closest to converter
      let totalWeight = 0;
      const weights: number[] = [];
      for (let i = 0; i < intermediaries.length; i++) {
        // Distance from converter: i=0 means closest to converter (last intermediary)
        const weight = Math.pow(this.decayFactor, i);
        weights.push(weight);
        totalWeight += weight;
      }
      
      // Distribute remaining pool proportionally based on weights
      // Iterate from converter-side backwards (last in path array = closest to converter)
      for (let i = intermediaries.length - 1; i >= 0; i--) {
        const action = intermediaries[i];
        const distanceFromConverter = intermediaries.length - 1 - i;
        const weight = weights[distanceFromConverter];
        const amount = Math.max((remainingPool * weight) / totalWeight, 0.01);
        
        splits.push({
          recipient: action.actorName,
          recipientAddress: action.actorWalletAddress || '',
          amount: amount.toFixed(2),
          role: action.actionType === 'remix' ? 'Remixer' : 'Sharer',
        });
      }
    }

    // Update actions with rewards
    for (const split of splits) {
      const action = path.find(a => a.actorName === split.recipient);
      if (action) {
        action.reward = split.amount;
      }
    }

    return splits;
  }

  getChain(contentId: string): ViralChain | undefined {
    return this.chains.get(contentId);
  }

  getAction(actionId: string): ViralAction | undefined {
    return this.actions.get(actionId);
  }

  getAllChains(): ViralChain[] {
    return Array.from(this.chains.values());
  }

  getMarkmapData(): string {
    // Generate markmap-compatible markdown
    let markdown = '# VibeCard Viral Network\n\n';
    
    const chains = Array.from(this.chains.values());
    for (let i = 0; i < chains.length; i++) {
      const chain = chains[i];
      markdown += `## ${chain.creatorName}'s Content\n\n`;
      
      // Build tree structure
      const buildTree = (parentId?: string, depth = 0): string => {
        const indent = '  '.repeat(depth);
        let tree = '';
        
        for (const action of chain.actions) {
          if (action.upstreamActionId === parentId || (!parentId && action.actionType === 'create')) {
            const reward = action.reward ? ` ($${action.reward})` : '';
            const icon = action.actionType === 'create' ? '🎨' 
              : action.actionType === 'remix' ? '🔄'
              : action.actionType === 'share' ? '📤'
              : '💰';
            
            tree += `${indent}- ${icon} ${action.actorName}${reward}\n`;
            tree += buildTree(action.id, depth + 1);
          }
        }
        
        return tree;
      };
      
      markdown += buildTree();
    }
    
    return markdown;
  }

  reset() {
    this.actions.clear();
    this.chains.clear();
    console.log('🔄 Viral tracking reset');
  }
}

export const viralTrackingService = new ViralTrackingService();
