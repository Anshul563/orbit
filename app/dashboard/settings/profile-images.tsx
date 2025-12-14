"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUploadCropper } from "@/components/image-upload-cropper"; // Use the component created previously
import { updateUserImages } from "./actions"; // Use the server action created previously
import { Camera, ImageIcon } from "lucide-react";
import { toast } from "sonner"; // Assuming you use Sonner for toasts
import Image from "next/image";

interface ProfileImagesProps {
  initialData: {
    id: string;
    name: string;
    image: string | null;
    coverImage: string | null;
  };
}

export function ProfileImages({ initialData }: ProfileImagesProps) {
  const [avatar, setAvatar] = useState(initialData.image || "");
  const [cover, setCover] = useState(initialData.coverImage || "");

  const handleAvatarUpdate = async (url: string) => {
    // Optimistic Update
    setAvatar(url);
    try {
      await updateUserImages({ image: url });
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error("Failed to update profile picture");
    }
  };

  const handleCoverUpdate = async (url: string) => {
    // Optimistic Update
    setCover(url);
    try {
      await updateUserImages({ coverImage: url });
      toast.success("Cover photo updated");
    } catch (error) {
      toast.error("Failed to update cover photo");
    }
  };

  return (
    <div className="group relative mb-12">
      {/* COVER PHOTO AREA (Aspect Ratio 4:1) */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
        {cover ? (
          <Image
            width={1920}
            height={1080}
            src={cover}
            alt="Cover"
            className="h-full w-full object-cover transition-opacity duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
            <ImageIcon className="h-12 w-12 opacity-50" />
          </div>
        )}

        {/* Edit Cover Button */}
        <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
          <ImageUploadCropper
            aspectRatio={1584 / 396} // Standard Cover Ratio (4:1)
            variant="cover"
            onUploadComplete={handleCoverUpdate}
          />
        </div>
      </div>

      {/* AVATAR AREA (Aspect Ratio 1:1) */}
      <div className="absolute -bottom-12 left-8">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-white shadow-xl bg-white">
            <AvatarImage src={avatar} className="object-cover" />
            <AvatarFallback className="text-4xl font-bold text-slate-400 bg-slate-100">
              {initialData.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Edit Avatar Button */}
          <div className="absolute bottom-0 right-0 z-10 translate-x-1/4 translate-y-1/4">
             {/* We wrap the cropper in a styled div to look like a floating button */}
            <div className="rounded-full bg-white p-1 shadow-md">
                <ImageUploadCropper
                    aspectRatio={1} // Square Ratio (1:1)
                    variant="avatar"
                    onUploadComplete={handleAvatarUpdate}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}