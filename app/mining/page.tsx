"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Pickaxe, Coins, Zap } from "lucide-react";

const miners = [
  { id: 1, name: "عامل تعدين أساسي", cost: 100, power: 1, speed: 5 },
  { id: 2, name: "عامل تعدين متقدم", cost: 500, power: 5, speed: 7 },
  { id: 3, name: "عامل تعدين فائق", cost: 2000, power: 25, speed: 10 },
  { id: 4, name: "عامل تعدين كوانتي", cost: 10000, power: 100, speed: 15 },
];

export default function Mining() {
  const [coins, setCoins] = useState(0);
  const [ownedMiners, setOwnedMiners] = useState<Record<number, number>>({});
  const [miningProgress, setMiningProgress] = useState<Record<number, number>>({});
  const [earnings, setEarnings] = useState<Record<number, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    const savedCoins = localStorage.getItem("coins");
    const savedMiners = localStorage.getItem("miners");
    if (savedCoins) setCoins(parseInt(savedCoins));
    if (savedMiners) setOwnedMiners(JSON.parse(savedMiners));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let totalEarnings = 0;
      const newProgress = { ...miningProgress };
      const newEarnings = { ...earnings };

      miners.forEach(miner => {
        if (ownedMiners[miner.id]) {
          newProgress[miner.id] = ((newProgress[miner.id] || 0) + miner.speed) % 100;
          if (newProgress[miner.id] >= 100) {
            const earned = miner.power * ownedMiners[miner.id];
            totalEarnings += earned;
            newEarnings[miner.id] = (newEarnings[miner.id] || 0) + earned;
          }
        }
      });

      if (totalEarnings > 0) {
        setCoins(prev => prev + totalEarnings);
        localStorage.setItem("coins", (coins + totalEarnings).toString());
      }

      setMiningProgress(newProgress);
      setEarnings(newEarnings);
    }, 1000);

    return () => clearInterval(interval);
  }, [ownedMiners, coins, miningProgress]);

  const buyMiner = (miner: typeof miners[0]) => {
    if (coins >= miner.cost) {
      setCoins(prev => prev - miner.cost);
      setOwnedMiners(prev => ({
        ...prev,
        [miner.id]: (prev[miner.id] || 0) + 1
      }));

      const newCoins = coins - miner.cost;
      const newMiners = {
        ...ownedMiners,
        [miner.id]: (ownedMiners[miner.id] || 0) + 1
      };

      localStorage.setItem("coins", newCoins.toString());
      localStorage.setItem("miners", JSON.stringify(newMiners));

      toast({
        title: "تم شراء عامل التعدين! ⛏️",
        description: `لقد اشتريت ${miner.name}`,
      });
    } else {
      toast({
        title: "أموال غير كافية 💸",
        description: `تحتاج إلى ${miner.cost - coins} عملات إضافية`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-md mx-auto pt-8 px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">مركز التعدين</h1>
        <Card className="p-4 inline-flex items-center gap-2 text-2xl font-semibold">
          <Coins className="h-6 w-6 text-yellow-500" />
          <span>{coins.toLocaleString()}</span> {/* عرض عدد العملات هنا */}
        </Card>
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence>
          {miners.map(miner => (
            <motion.div
              key={miner.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {miner.name}
                      <Zap className="h-4 w-4 text-yellow-500" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      القوة: {miner.power} عملات/دورة • السرعة: {miner.speed}%/ث
                    </p>
                  </div>
                  <Button
                    onClick={() => buyMiner(miner)}
                    variant={coins >= miner.cost ? "default" : "outline"}
                    className="gap-2"
                  >
                    <Coins className="h-4 w-4" />
                    {miner.cost.toLocaleString()}
                  </Button>
                </div>
                
                {ownedMiners[miner.id] ? (
                  <div className="space-y-2">
                    <Progress value={miningProgress[miner.id] || 0} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Pickaxe className="h-4 w-4" />
                        <span>مملوك: {ownedMiners[miner.id]}</span>
                      </div>
                      {earnings[miner.id] > 0 && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-green-500"
                        >
                          +{earnings[miner.id].toLocaleString()} عملات/دورة
                        </motion.span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">قم بالشراء لبدء التعدين</p>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
