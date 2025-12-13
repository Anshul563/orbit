"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export function WalletCard({ balance }: { balance: number }) {
  return (
    <Card className="bg-card text-white border-slate-800 relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <CreditCard className="w-48 h-48 text-slate-800 dark:text-slate-200 -rotate-12" />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Total Balance
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-bold font-mono text-slate-800 dark:text-slate-200">{balance}</span>
          <span className="text-sm font-medium text-slate-400">CREDITS</span>
        </div>

        <div className="flex relative gap-3">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="h-4 w-4" /> Add Funds
          </Button>
          <Button variant="secondary" className="flex-1 gap-2 bg-slate-800 text-slate-200 hover:bg-slate-700">
            <ArrowDownLeft className="h-4 w-4" /> Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}