import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWalletData } from "./actions";
import { WalletCard } from "./wallet-card";
import { TransactionList } from "./transaction-list";

export default async function WalletPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  const { balance, transactions } = await getWalletData();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">My Wallet</h1>
        <p className="text-slate-500">Manage your credits and view payment history.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        {/* Left Column: Balance Card */}
        <div className="space-y-6">
           <WalletCard balance={balance} />
           
           {/* Info Box */}
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
             <p className="font-bold mb-1">💡 How Credits Work</p>
             <p>Earn credits by completing tasks. Spend credits to hire help. 1 Credit ≈ 1 Minute of skilled work.</p>
           </div>
        </div>

        {/* Right Column: History */}
        <TransactionList 
          transactions={transactions} 
          currentUserId={session.user.id} 
        />
      </div>
    </div>
  );
}