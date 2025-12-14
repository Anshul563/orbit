"use client";

import { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, Upload, Camera } from "lucide-react";
import { getCroppedImg } from "@/lib/canvas-utils";
// Ensure you have this hook set up
import { toast } from "sonner"; // or your preferred toast
import { useUploadThing } from "@/lib/uploadthing";

interface ImageUploadCropperProps {
  aspectRatio: number; // 1 for square, 4/1 for cover
  onUploadComplete: (url: string) => void;
  variant?: "avatar" | "cover";
}

export function ImageUploadCropper({
  aspectRatio,
  onUploadComplete,
  variant = "avatar",
}: ImageUploadCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("imageUploader"); // Make sure "imageUploader" exists in your core.ts

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
      setIsOpen(true);
      // Reset input so same file can be selected again if needed
      e.target.value = "";
    }
  };

  const readFile = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setLoading(true);

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Could not crop image");

      const file = new File([croppedBlob], "cropped-image.jpg", {
        type: "image/jpeg",
      });

      // Upload to UploadThing
      const res = await startUpload([file]);

      if (res && res[0]) {
        onUploadComplete(res[0].url);
        setIsOpen(false);
        setImageSrc(null);
        toast.success("Image updated successfully!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer"
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={onFileChange}
        />
        {variant === "avatar" ? (
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 border shadow-sm hover:bg-slate-100 transition">
            <Camera className="h-4 w-4 text-slate-600" />
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm"
          >
            <Camera className="h-4 w-4" /> Edit Cover
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adjust Image</DialogTitle>
          </DialogHeader>

          <div className="relative w-full h-[400px] bg-slate-950 rounded-md overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={(_, croppedAreaPixels) =>
                  setCroppedAreaPixels(croppedAreaPixels)
                }
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="py-4 space-y-2">
            <span className="text-sm font-medium text-slate-500">Zoom</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(val) => setZoom(val[0])}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
