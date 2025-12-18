import { GoogleAuthButton } from "@/components/google-auth-button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomeIcon } from "lucide-react";

export default function LoginPage() {
  return (
    <BackgroundLines>
      <div className="absolute z-50 inset-0 flex h-screen w-screen items-center justify-center px-4">
        <div className="flex flex-row bg-card rounded-xl border-accent w-[80%] h-[500px] overflow-hidden shadow-xl">
          {/* LEFT: LOGIN CONTENT */}
          <div className="flex md:w-[45%] h-[500px] flex-col justify-center gap-6 px-8 py-12">
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight ">
                Welcome Back 👋
              </h1>
              <p className="text-sm text-muted-foreground">
                Login to your account to start matching with other students.
              </p>
            </div>

            <GoogleAuthButton />

            <p className="text-xs text-muted-foreground text-center">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
            <Link className="mx-auto" href="/">
              <Button size="lg" className="" variant={"link"}>
                <HomeIcon className="ml-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </div>

          {/* RIGHT: IMAGE SECTION */}
          {/* Added 'h-full' to ensure it stretches to match the login side */}
          <div className="relative hidden md:block w-[55%] min-h-[500px] flex-col bg-muted">
            <Image
              src="/login.jpg"
              alt="Students collaborating"
              fill
              className="object-cover"
              priority
            />

            {/* OVERLAY: Slightly darker gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* TEXT ON IMAGE */}
            <div className="relative z-10 flex flex-col justify-between h-full p-10 ">
              <Image
                src="/text.png"
                alt="logo"
                width={100}
                height={100}
                className="object-cover"
                priority
              />
              <div className="">
                <h2 className="text-2xl font-bold leading-tight text-white/90">
                  "Orbit helped to trade your skills with other students"
                </h2>
                <p className="text-sm text-white/70 font-light">The exclusive student marketplace. Swap skills, get homework help, and build your portfolio—all without spending a dime. One credit earned is one credit spent.</p>
                <p className="mt-4 text-sm text-white/70 font-medium">
                  — Created with ❤️ by <Link className="underline hover:text-blue-500" target="_blank" href="https://anshulshakya.com">Anshul Shakya</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundLines>
  );
}
