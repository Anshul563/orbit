"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export function WalletCard({ balance }: { balance: number }) {
  return (
    <Card className="bg-card text-white border-slate-800 relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <CreditCard className="w-48 h-48 text-primary dark:text-primary-foreground -rotate-12" />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-primary uppercase tracking-wider">
          Total Balance
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline gap-2 mb-6 relative">
          <span className="text-6xl font-bold font-mono text-neutral-800 dark:text-neutral-200">{balance}</span>
          <span className="text-md font-medium text-neutral-400">Credits</span>
        </div>
      </CardContent>
    </Card>
  );
}