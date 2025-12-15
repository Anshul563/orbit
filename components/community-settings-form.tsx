"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  generateInviteLink,
  updateCommunity,
  promoteMember, // Import this
} from "@/app/dashboard/community/actions";
import { toast } from "sonner";
import {
  Copy,
  RefreshCw,
  Save,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageUploadCropper } from "@/components/image-upload-cropper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Member {
  userId: string;
  role: string;
  user: {
    name: string;
    image: string | null;
    email: string;
  };
}

interface SettingsProps {
  community: {
    id: string;
    name: string;
    description: string | null;
    isPrivate: boolean | null;
    inviteCode: string | null;
    image: string | null;
    coverImage: string | null;
    ownerId: string;
  };
  members: Member[]; // Pass members from page.tsx
}

export function CommunitySettingsForm({ community, members }: SettingsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState(
    community.inviteCode
      ? `${process.env.NEXT_PUBLIC_URL || window.location.origin}/join/${
          community.inviteCode
        }`
      : ""
  );

  const [formData, setFormData] = useState({
    name: community.name,
    description: community.description || "",
    isPrivate: community.isPrivate || false,
    image: community.image || "",
    coverImage: community.coverImage || "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to handle base64 conversion for previews
  const processImageCrop = (blob: Blob, field: "image" | "coverImage") => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange(field, reader.result as string);
      toast.success(`${field === "image" ? "Profile" : "Cover"} image ready`);
    };
    reader.readAsDataURL(blob);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("isPrivate", String(formData.isPrivate));
      data.append("image", formData.image);
      data.append("coverImage", formData.coverImage);

      await updateCommunity(community.id, data);
      toast.success("Community updated successfully");
      router.push(`/dashboard/community/${community.id}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (memberId: string) => {
    try {
      await promoteMember(community.id, memberId);
      toast.success("Member promoted to Admin");
      router.refresh();
    } catch (e) {
      toast.error("Failed to promote");
    }
  };

  const handleGenerateLink = async () => {
    try {
      const res = await generateInviteLink(community.id);
      setInviteLink(res.inviteLink);
      toast.success("New invite link generated");
    } catch (error) {
      toast.error("Error generating link");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <Link
        href={`/dashboard/community/${community.id}`}
        className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Chat
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Community Settings</h1>
          <p className="text-slate-500">
            Manage branding, access, and members.
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* 1. Branding Section (Cover + Profile) */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Customize how your community looks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Visual Preview Container */}
          <div className="group relative w-full rounded-xl overflow-hidden border">
            {/* Cover Image Area (16:9) */}
            <div className="relative w-full h-48 md:h-64 bg-slate-200">
              {formData.coverImage ? (
                <img
                  src={formData.coverImage}
                  className="w-full h-full object-cover"
                  alt="Cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                  No Cover Image
                </div>
              )}

              {/* Cover Upload Trigger */}
              <div className="absolute top-4 right-4">
                <ImageUploadCropper
                  aspectRatio={16 / 9}
                  onImageCropped={(b) => processImageCrop(b, "coverImage")}
                />
              </div>
            </div>

            {/* Profile Image Area (1:1) - Overlapping */}
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-end">
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-sm bg-white">
                  <AvatarImage src={formData.image} className="object-cover" />
                  <AvatarFallback className="text-2xl">
                    {formData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Profile Upload Trigger */}
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
                  <ImageUploadCropper
                    aspectRatio={1}
                    onImageCropped={(b) => processImageCrop(b, "image")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Community Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Member Management */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Manage roles and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback>
                      {member.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{member.user.name}</p>
                    <p className="text-xs text-slate-500">
                      {member.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.role === "admin" ||
                  member.userId === community.ownerId ? (
                    <Badge
                      variant="secondary"
                      className=" text-blue-700 hover:bg-blue-100"
                    >
                      <ShieldCheck className="h-3 w-3 mr-1" /> Admin
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePromote(member.userId)}
                    >
                      Make Admin
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Privacy & Invites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">Private Community</Label>
                <p className="text-sm text-slate-500">
                  {formData.isPrivate
                    ? "Hidden from search."
                    : "Publicly visible."}
                </p>
              </div>
              <Switch
                checked={formData.isPrivate}
                onCheckedChange={(val) => handleChange("isPrivate", val)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={inviteLink || "No link"}
                readOnly
                className="bg-slate-50"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={copyLink}
                disabled={!inviteLink}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={handleGenerateLink}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
