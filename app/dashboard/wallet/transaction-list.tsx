"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface Transaction {
  id: string;
  amount: number;
  type: string; // "payment", "deposit", etc.
  createdAt: Date | null;
  senderId: string | null;
  receiverId: string | null;
  sender: { name: string; image: string | null } | null;
  receiver: { name: string; image: string | null } | null;
}

export function TransactionList({
  transactions,
  currentUserId,
}: {
  transactions: Transaction[];
  currentUserId: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No transactions yet.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => {
              const isIncoming = tx.receiverId === currentUserId;
              const otherUser = isIncoming ? tx.sender : tx.receiver;

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b  p-2 rounded-lg hover:bg-card transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        isIncoming
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      )}
                    >
                      {isIncoming ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-sm dark:text-slate-200">
                        {isIncoming ? "Received from" : "Sent to"}{" "}
                        {otherUser?.name || "System"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-100 capitalize">
                        {tx.type.replace("_", " ")} •{" "}
                        {tx.createdAt
                          ? format(new Date(tx.createdAt), "MMM d, h:mm a")
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "font-bold font-mono text-slate-200",
                      isIncoming ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {isIncoming ? "+" : "-"}
                    {tx.amount}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
