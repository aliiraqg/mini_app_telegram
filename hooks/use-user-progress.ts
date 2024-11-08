"use client";

import { useState, useEffect } from 'react';

export function useUserProgress() {
  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get or generate user ID
    const storedUserId = localStorage.getItem('userId');
    const newUserId = storedUserId || `user_${Math.random().toString(36).slice(2)}`;
    if (!storedUserId) {
      localStorage.setItem('userId', newUserId);
    }
    setUserId(newUserId);

    // Load user progress
    const savedProgress = localStorage.getItem(`progress_${newUserId}`);
    if (savedProgress) {
      const { coins: savedCoins, multiplier: savedMultiplier, progress: savedProgressValue } = JSON.parse(savedProgress);
      setCoins(savedCoins);
      setMultiplier(savedMultiplier);
      setProgress(savedProgressValue);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`progress_${userId}`, JSON.stringify({
        coins,
        multiplier,
        progress
      }));
    }
  }, [coins, multiplier, progress, userId]);

  return {
    coins,
    setCoins,
    multiplier,
    setMultiplier,
    progress,
    setProgress,
    userId
  };
}