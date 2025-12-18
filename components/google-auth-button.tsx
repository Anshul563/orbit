"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client"; // Import your Better-Auth client
import Image from "next/image";

interface GoogleAuthButtonProps {
  text?: string;
  className?: string;
}

export function GoogleAuthButton({
  text = "Continue with Google",
  className,
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", // Redirect here after success
      });
    } catch (error) {
      console.error("Google login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      onClick={handleGoogleLogin}
      className={` font-medium relative ${className}`}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (

        <Image
          src="/google.png"
          alt="Google"
          width={24}
          height={24}
          className="mr-2"
        />
      )}
      {text}
    </Button>
  );
}
