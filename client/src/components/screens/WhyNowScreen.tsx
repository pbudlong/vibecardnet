import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const timelineData = [
  {
    year: "2017",
    title: "Stablecoins Emerge",
    status: "blocked",
    items: [
      { text: "No mainstream adoption", blocked: true },
      { text: "No developer tooling", blocked: true },
      { text: "High gas fees", blocked: true },
    ],
  },
  {
    year: "2020",
    title: "USDC Gains Traction",
    status: "blocked",
    items: [
      { text: "Still expensive to transact", blocked: true },
      { text: "No embedded wallet solutions", blocked: true },
      { text: "UX requires crypto expertise", blocked: true },
    ],
  },
  {
    year: "2023",
    title: "L2s Reduce Gas Costs",
    status: "partial",
    items: [
      { text: "Transactions under $0.10", blocked: false },
      { text: "Still fragmented ecosystem", blocked: true },
      { text: "Bridge complexity", blocked: true },
    ],
  },
  {
    year: "2024",
    title: "Account Abstraction",
    status: "partial",
    items: [
      { text: "Users don't need to understand crypto", blocked: false },
      { text: "Social login → wallet", blocked: false },
      { text: "Payment protocols immature", blocked: true },
    ],
  },
  {
    year: "2025",
    title: "All Pieces In Place",
    status: "ready",
    items: [
      { text: "Native USDC chain (Arc)", blocked: false },
      { text: "Embedded wallets (Circle)", blocked: false },
      { text: "Micropayment protocol (x402)", blocked: false },
      { text: "Gas costs ~$0.001", blocked: false },
    ],
  },
];

const enablers = [
  {
    name: "Content Growth",
    description: "Vibe coding platforms are creating 100,000+ new apps per day.",
  },
  {
    name: "Missing Reach",
    description: "These builders can ship in minutes but need help marketing.",
  },
  {
    name: "Crypto Leverage",
    description: "VibeCard creates the distribution layer for the long tail of UGS.",
  },
];

export function WhyNowScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          Why Now?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The convergence of enabling technologies makes VibeCard possible today.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl">
        <div className="flex gap-2 md:gap-4 justify-center mb-3 overflow-x-auto pb-2">
          {timelineData.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <Card
                className={`p-3 w-36 md:w-40 ${
                  item.status === "ready"
                    ? "border-primary border-2 bg-primary/5"
                    : ""
                }`}
              >
                <div className="text-center mb-2">
                  <Badge
                    variant={item.status === "ready" ? "default" : "secondary"}
                    className="text-base font-display font-bold px-2 py-0.5"
                  >
                    {item.year}
                  </Badge>
                </div>
                <h3 className="font-semibold text-xs text-center mb-2 leading-tight">
                  {item.title}
                </h3>
                <ul className="space-y-1">
                  {item.items.map((listItem, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-1.5 text-xs ${
                        listItem.blocked
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {listItem.blocked ? (
                        <X className="h-3.5 w-3.5 text-destructive flex-shrink-0 mt-0.5" />
                      ) : (
                        <Check className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                      )}
                      <span>{listItem.text}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            The Cambrian Explosion of User-Generated Software (UGS)
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {enablers.map((enabler, index) => (
              <motion.div
                key={enabler.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <Card className="p-5 w-72 text-left">
                  <h3 className="font-display font-bold text-lg text-primary mb-2">
                    {enabler.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {enabler.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center text-lg font-medium text-muted-foreground italic"
        >
          "UGS and robot money will kick off a new wave of exponential viral growth."
        </motion.p>
      </div>
    </div>
  );
}
