"use client";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard", // Where to go after login
    });
  };

  return (
    <div className="flex h-screen items-center justify-center gap-4">
      <h1 className="font-display text-4xl">Orbit</h1>
      <button
        onClick={handleLogin}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
}