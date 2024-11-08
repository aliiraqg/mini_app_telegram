"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Users, Share2, Gift, Coins } from "lucide-react";
import { useUserProgress } from "@/hooks/use-user-progress";

export default function اجتماعي() {
  const { toast } = useToast();
  const { coins, setCoins, userId } = useUserProgress();
  const [referralCode, setReferralCode] = useState("");
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    if (userId) {
      const uniqueCode = userId.slice(0, 8); // استخدم أول 8 أحرف من userId كرمز إحالة
      setReferralCode(uniqueCode);
      const savedFriends = localStorage.getItem(`friends_${userId}`);
      if (savedFriends) {
        setFriends(JSON.parse(savedFriends));
      }
    }
  }, [userId]);

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

  // وظيفة لتحصيل المكافآت عند استخدام رابط الإحالة
  const handleNewReferral = (newUserId: string) => {
    if (newUserId && !friends.includes(newUserId)) {
      setFriends(prev => [...prev, newUserId]);
      setCoins(prev => prev + 1000); // كسب 1000 عملة للشخص الذي قام بالدعوة
      // إضافة 1000 عملة للمستخدم المدعو
      // يجب أن يكون لديك طريقة لتحديد ذلك في نظامك
      toast({
        title: "تم إضافة صديق جديد! 🎉",
        description: "لقد حصلت على 1,000 عملة!",
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
        <h1 className="text-4xl font-bold mb-4">الأصدقاء</h1>
        <Card className="p-4 inline-flex items-center gap-2 text-2xl font-semibold">
          <Users className="h-6 w-6 text-blue-500" />
          <span>{friends.length}</span>
        </Card>
      </motion.div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            دعوة الأصدقاء
          </h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input value={referralCode} readOnly />
              <Button onClick={handleInvite}>نسخ</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              شارك رمزك مع الأصدقاء لكسب المكافآت!
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5" />
            إدخال رمز الإحالة
          </h2>
          <p className="text-sm text-muted-foreground">
            استخدم رابط البوت للدعوة، ولا حاجة لإدخال أي رمز يدوي.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">أصدقاؤك</h2>
          <div className="space-y-2">
            {friends.length > 0 ? (
              friends.map((friend, index) => (
                <div
                  key={friend}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span className="font-medium">الصديق #{index + 1}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span>+1,000</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                لا يوجد أصدقاء بعد. ابدأ في الدعوة!
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
