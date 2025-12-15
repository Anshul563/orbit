// src/components/community-settings.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ImageUploadCropper } from "@/components/image-upload-cropper"; // Reuse your component
import { generateInviteLink } from "@/app/dashboard/community/actions";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";

export function CommunitySettings({ communityId, isPrivate, initialImage }: any) {
  const [inviteUrl, setInviteUrl] = useState("");

  const handleGenerate = async () => {
    const res = await generateInviteLink(communityId);
    setInviteUrl(res.inviteLink);
    toast.success("Invite link generated!");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-8 p-6 border rounded-xl bg-white">
      
      {/* 1. Community Image */}
      <div className="space-y-4">
         <h3 className="font-medium">Community Cover</h3>
         <ImageUploadCropper 
            aspectRatio={16/9} 
            variant="cover" 
            onUploadComplete={(url) => console.log("Update DB with:", url)} 
         />
      </div>

      {/* 2. Privacy Toggle */}
      <div className="flex items-center justify-between">
        <div>
            <h3 className="font-medium">Private Community</h3>
            <p className="text-sm text-slate-500">Hidden from search. Only visible to members.</p>
        </div>
        <Switch defaultChecked={isPrivate} onCheckedChange={(val) => console.log("Update privacy:", val)} />
      </div>

      {/* 3. Invite Link */}
      <div className="space-y-2">
        <h3 className="font-medium">Invite Members</h3>
        <div className="flex gap-2">
            <Input value={inviteUrl || "No active link"} readOnly />
            <Button size="icon" variant="outline" onClick={copyLink} disabled={!inviteUrl}>
                <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={handleGenerate}>
                {inviteUrl ? <RefreshCw className="h-4 w-4 mr-2" /> : "Generate"} 
                {inviteUrl ? "Reset" : "Create Link"}
            </Button>
        </div>
      </div>

    </div>
  );
}