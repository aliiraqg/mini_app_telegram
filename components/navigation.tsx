"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Wallet, Pickaxe, Users, Trophy, Scroll } from "lucide-react";

const Navigation = () => {
  const pathname = usePathname();
  
  const routes = [
    {
      href: "/",
      label: "Click",
      icon: Wallet,
    },
    {
      href: "/mining",
      label: "Mining",
      icon: Pickaxe,
    },
    {
      href: "/social",
      label: "Friends",
      icon: Users,
    },
    {
      href: "/leaderboard",
      label: "Top 10",
      icon: Trophy,
    },
    {
      href: "/missions",
      label: "Missions",
      icon: Scroll,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-around">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant={pathname === route.href ? "default" : "ghost"}
              className={cn(
                "flex flex-col gap-1 h-14 hover:bg-muted",
                pathname === route.href && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <route.icon className="h-5 w-5" />
              <span className="text-xs">{route.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;