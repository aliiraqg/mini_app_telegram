"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TonConnectButton, TonConnectUIProvider } from "@tonconnect/ui-react";
import Image from "next/image";
import { useUserProgress } from "@/hooks/use-user-progress";

const manifestUrl = "https://example.com/manifest.json"; // استبدل بهذا العنوان الصحيح

export default function Home() {
  const { toast } = useToast();
  const { 
    coins, 
    setCoins, 
    multiplier, 
    setMultiplier, 
    progress, 
    setProgress, 
    userId // إضافة userId للحصول على رمز الإحالة
  } = useUserProgress();
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number } | null>(null);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    if (userId) {
      const uniqueCode = userId.slice(0, 8); // استخدم أول 8 أحرف من userId كرمز إحالة
      setReferralCode(uniqueCode);
    }
  }, [userId]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClickEffect({ x, y });
    setTimeout(() => setClickEffect(null), 500);

    const earned = multiplier;
    setCoins(prev => {
      const newCoins = prev + earned;
      localStorage.setItem("coins", newCoins.toString()); // تحديث العملات في localStorage
      return newCoins;
    });

    setProgress(prev => {
      const newProgress = prev + 5;
      if (newProgress >= 100) {
        const newMultiplier = multiplier + 1;
        setMultiplier(newMultiplier);
        toast({
          title: "ترقية! 🎉",
          description: `قوة نقرك زادت إلى ${newMultiplier}x`,
        });
        return 0;
      }
      return newProgress;
    });
  };

  const handleInvite = async () => {
    const telegramBotLink = "https://t.me/YourBotUsername"; // استبدل باسم المستخدم الخاص ببوت تلغرام
    const message = `انضم إلي في Crypto Clicker! استخدم رمزي: ${referralCode} \n🚀 للبدء، تفضل بزيارة: ${telegramBotLink}?ref=${referralCode}`;
    
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "تم النسخ! 📋",
        description: "تم نسخ رابط الإحالة إلى الحافظة",
      });
    } catch (err) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ رابط الإحالة",
        variant: "destructive",
      });
    }
  };

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <div className="container max-w-md mx-auto pt-8 px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">لعبة النقر على العملات المشفرة</h1>
          <div className="flex flex-col gap-4 items-center">
            <Card className="p-4 inline-flex items-center gap-2 text-2xl font-semibold">
              <Coins className="h-6 w-6 text-yellow-500" />
              <span>{coins.toLocaleString()}</span>
            </Card>
            <TonConnectButton />
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="relative">
            <Progress value={progress} className="h-3" />
            <span className="absolute right-0 top-4 text-sm text-muted-foreground">
              {progress}%
            </span>
          </div>

          <motion.div className="flex justify-center relative" initial={false}>
            <Button
              size="lg"
              className="w-40 h-40 rounded-full text-xl font-bold relative overflow-hidden group"
              onClick={handleClick}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/ton-coin.png"
                  alt="عملة TON"
                  width={120}
                  height={120}
                  className="group-hover:scale-95 transition-transform"
                />
              </div>
              {clickEffect && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute pointer-events-none"
                  style={{ left: clickEffect.x, top: clickEffect.y }}
                >
                  <Image
                    src="/ton-coin.png"
                    alt="تأثير عملة TON"
                    width={32}
                    height={32}
                    className="animate-spin"
                  />
                </motion.div>
              )}
            </Button>
          </motion.div>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">الإحصائيات</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">قوة النقرة</span>
                <motion.span
                  key={multiplier}
                  initial={{ scale: 1.5, color: "#facc15" }}
                  animate={{ scale: 1, color: "#ffffff" }}
                  className="font-semibold"
                >
                  x{multiplier}
                </motion.span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">المرحلة التالية</span>
                <span className="font-semibold">{100 - progress} نقرات</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">دعوة الأصدقاء</h2>
            <div className="flex gap-2">
              <Button onClick={handleInvite}>دعوة</Button> {/* Button to invite friends */}
            </div>
          </Card>
        </div>
      </div>
    </TonConnectUIProvider>
  );
}
