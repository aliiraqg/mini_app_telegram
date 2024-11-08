"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Scroll, Check, Star, Coins } from "lucide-react";
import { useUserProgress } from "@/hooks/use-user-progress";

type مهمة = {
  id: number;
  title: string;
  description: string;
  reward: number;
  target: number;
  progress: number;
  completed: boolean;
};

export default function المهام() {
  const { coins, setCoins, userId } = useUserProgress();
  const { toast } = useToast();
  const [missions, setMissions] = useState<مهمة[]>([]);

  useEffect(() => {
    const savedMissions = localStorage.getItem(`missions_${userId}`);
    if (savedMissions) {
      setMissions(JSON.parse(savedMissions));
    } else {
      const initialMissions: مهمة[] = [
        {
          id: 1,
          title: "المبتدئ في النقر", // Clicking Novice
          description: "انقر 100 مرة", // Click 100 times
          reward: 500,
          target: 100,
          progress: 0,
          completed: false,
        },
        {
          id: 2,
          title: "سيد التعدين", // Mining Master
          description: "امتلك 5 عمال تعدين", // Own 5 miners
          reward: 1000,
          target: 5,
          progress: 0,
          completed: false,
        },
        {
          id: 3,
          title: "فراشة اجتماعية", // Social Butterfly
          description: "دعوة 3 أصدقاء", // Invite 3 friends
          reward: 2000,
          target: 3,
          progress: 0,
          completed: false,
        },
        {
          id: 4,
          title: "باحث عن الثروة", // Fortune Seeker
          description: "اكسب 10,000 عملة", // Earn 10,000 coins
          reward: 5000,
          target: 10000,
          progress: coins,
          completed: false,
        },
      ];
      setMissions(initialMissions);
      localStorage.setItem(`missions_${userId}`, JSON.stringify(initialMissions));
    }
  }, [userId, coins]);

  const claimReward = (mission: مهمة) => {
    if (mission.progress >= mission.target && !mission.completed) {
      const updatedMissions = missions.map(m =>
        m.id === mission.id ? { ...m, completed: true } : m
      );
      setMissions(updatedMissions);
      setCoins(prev => prev + mission.reward);
      localStorage.setItem(`missions_${userId}`, JSON.stringify(updatedMissions));
      
      toast({
        title: "المهمة مكتملة! 🎉", // Mission Complete! 🎉
        description: `لقد حصلت على ${mission.reward.toLocaleString()} عملة!`, // You earned x coins!
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
        <h1 className="text-4xl font-bold mb-4">المهام</h1> 
        <Card className="p-4 inline-flex items-center gap-2 text-2xl font-semibold">
          <Scroll className="h-6 w-6 text-purple-500" />
          <span>
            {missions.filter(m => m.completed).length}/{missions.length}
          </span>
        </Card>
      </motion.div>

      <div className="space-y-4">
        {missions.map((mission) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {mission.title}
                    {mission.completed && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {mission.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Coins className="h-4 w-4" />
                  <span>{mission.reward.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Progress
                  value={(mission.progress / mission.target) * 100}
                  className="h-2"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {mission.progress}/{mission.target}
                  </span>
                  {mission.progress >= mission.target && !mission.completed ? (
                    <Button
                      size="sm"
                      onClick={() => claimReward(mission)}
                      className="gap-1"
                    >
                      <Star className="h-4 w-4" />
                      استرداد // Claim
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
