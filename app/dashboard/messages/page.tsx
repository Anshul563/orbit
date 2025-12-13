import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createTestConversation, getConversations } from "./actions";
import { ChatInterface } from "./chat-interface";
import { Button } from "@/components/ui/button";

export default async function MessagesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  const conversations = await getConversations();

  

  return (
    
    <div className="max-w-6xl mx-auto h-full">
      <ChatInterface
        conversations={conversations}
        currentUserId={session.user.id}
      />
    </div>
  );
}
