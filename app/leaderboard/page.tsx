"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Award } from "lucide-react";
import { useUserProgress } from "@/hooks/use-user-progress";

type LeaderboardEntry = {
  id: string;
  coins: number;
  rank: number;
};

export default function Leaderboard() {
  const { userId, coins } = useUserProgress();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    // Simulate leaderboard data
    const generateLeaderboard = () => {
      const entries: LeaderboardEntry[] = Array.from({ length: 10 }, (_, i) => ({
        id: `user_${Math.random().toString(36).slice(2)}`,
        coins: Math.floor(Math.random() * 1000000) + 100000,
        rank: i + 1
      }));

      // Add current user if they have enough coins
      if (coins > 0) {
        entries.push({
          id: userId!,
          coins: coins,
          rank: 0
        });
      }

      // Sort by coins
      entries.sort((a, b) => b.coins - a.coins);

      // Update ranks
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
        if (entry.id === userId) {
          setUserRank(entry.rank);
        }
      });

      return entries.slice(0, 10);
    };

    setLeaderboard(generateLeaderboard());
  }, [userId, coins]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="container max-w-md mx-auto pt-8 px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
        <Card className="p-4 inline-flex items-center gap-2 text-2xl font-semibold">
          <Trophy className="h-6 w-6 text-yellow-500" />
          {userRank ? (
            <span>Your Rank: #{userRank}</span>
          ) : (
            <span>Start clicking!</span>
          )}
        </Card>
      </motion.div>

      <div className="space-y-4">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-4 ${entry.id === userId ? "border-2 border-primary" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {entry.id === userId ? "You" : `Player ${entry.rank}`}
                    </span>
                    {entry.id === userId && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {entry.coins.toLocaleString()} coins
                  </div>
                </div>
                <div className="text-2xl font-bold">#{entry.rank}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
