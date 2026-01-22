import { randomBytes } from 'crypto';
import { registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets';

async function setupCircleEntitySecret() {
  const apiKey = process.env.CIRCLE_API_KEY;
  
  if (!apiKey) {
    console.error('❌ CIRCLE_API_KEY not found in environment');
    process.exit(1);
  }

  console.log('🔐 Generating new Entity Secret...');
  const entitySecret = randomBytes(32).toString('hex');
  
  console.log('\n📋 Your Entity Secret (save this to CIRCLE_ENTITY_SECRET):');
  console.log('─'.repeat(68));
  console.log(entitySecret);
  console.log('─'.repeat(68));

  console.log('\n📝 Registering Entity Secret with Circle...');
  
  try {
    const response = await registerEntitySecretCiphertext({
      apiKey,
      entitySecret,
      recoveryFileDownloadPath: './',
    });

    console.log('\n✅ Entity Secret registered successfully!');
    console.log('📁 Recovery file saved:', response.data?.recoveryFile);
    console.log('\n⚠️  IMPORTANT: Update your CIRCLE_ENTITY_SECRET in Replit Secrets with the value above');
    console.log('⚠️  IMPORTANT: Keep the recovery file safe - you need it if you lose your entity secret');
  } catch (error: any) {
    console.error('\n❌ Registration failed:', error.message || error);
    if (error.response?.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

setupCircleEntitySecret();
