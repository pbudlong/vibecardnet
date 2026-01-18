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
    name: "Arc",
    description: "Native USDC blockchain",
    detail: "No bridges, instant settlement",
  },
  {
    name: "Circle Wallets",
    description: "Embedded wallet SDK",
    detail: "No seed phrases, social login",
  },
  {
    name: "x402 Protocol",
    description: "Micropayment standard",
    detail: "Atomic multi-party splits",
  },
];

export function WhyNowScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 py-12 overflow-auto">
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
        <div className="flex gap-2 md:gap-4 justify-center mb-12 overflow-x-auto pb-4">
          {timelineData.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <Card
                className={`p-4 w-40 md:w-48 ${
                  item.status === "ready"
                    ? "border-primary border-2 bg-primary/5"
                    : ""
                }`}
              >
                <div className="text-center mb-3">
                  <Badge
                    variant={item.status === "ready" ? "default" : "secondary"}
                    className="text-lg font-display font-bold px-3 py-1"
                  >
                    {item.year}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm text-center mb-3 min-h-[2.5rem]">
                  {item.title}
                </h3>
                <ul className="space-y-1.5">
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
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
            The Three Enablers
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {enablers.map((enabler, index) => (
              <motion.div
                key={enabler.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <Card className="p-5 w-64 text-left">
                  <h3 className="font-display font-bold text-xl text-primary mb-1">
                    {enabler.name}
                  </h3>
                  <p className="font-medium text-foreground text-sm mb-1">
                    {enabler.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {enabler.detail}
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
          "This was impossible before. Now it's inevitable."
        </motion.p>
      </div>
    </div>
  );
}
