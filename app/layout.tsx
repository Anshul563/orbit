import type { Metadata } from "next";
import { Ubuntu, Delius_Swash_Caps } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"


// 1. Configure the fonts
const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // Select weights you need
  variable: "--font-ubuntu", // Defines a CSS variable for Tailwind
});

const delius = Delius_Swash_Caps({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-delius-cursive",
});

export const metadata: Metadata = {
  title: "Orbit",
  description: "Connect. Collaborate. Trade Skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. Apply the variables to the body */}
      <body
        className={`${ubuntu.variable} ${delius.variable} antialiased font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}