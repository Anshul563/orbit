import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Users, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { AuroraText } from "@/components/ui/aurora-text";
import { Highlighter } from "@/components/ui/highlighter";
import Image from "next/image";
import BentoFeatures from "@/components/BentoFeatures";
import { HowItWorks } from "@/components/how-it-works";
import { Marquee } from "@/components/ui/marquee";
import { MarqueeComponent } from "@/components/MarqueeComponent";
import { Footer } from "@/components/Footer";
import { authClient } from "@/lib/auth-client";
import { GoogleAuthButton } from "@/components/google-auth-button";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If logged in, go straight to the app
  if (session) {
    redirect("/dashboard");
  }

 

  return (
    <div className="min-h-screen text-slate-900">
      {/* Background Grid Pattern */}
      <div
        className={cn(
          "absolute inset-0 -z-10",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      {/* --- NAVIGATION --- */}
      <nav className="backdrop-blur-sm sticky top-0 z-50 border-b border-transparent">
        <Navbar />
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 md:pt-28 md:pb-28 overflow-hidden">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-3xl -z-10 opacity-60 mix-blend-multiply" />
        <div className="absolute top-0 right-0 w-[800px] h-[600px] rounded-full blur-3xl -z-10 opacity-60 mix-blend-multiply" />

        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 backdrop-blur-2xl py-1 rounded-full border border-neutral-500 text-neutral-700 dark:text-neutral-200 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Loved by 500+ Students
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight dark:text-white text-slate-900 mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Don't Spend Money. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              <AuroraText>Spend Talent.</AuroraText>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            The exclusive{" "}
            <Highlighter action="highlight" color="#FF9800">
              student marketplace
            </Highlighter>
            .{" "}
            <Highlighter action="circle" color="#FF9800">
              Swap skills
            </Highlighter>
            , get homework help, and build your portfolio—all without spending a
            dime. One{" "}
            <Highlighter action="underline" color="#FF9800">
              credit
            </Highlighter>{" "}
            earned is one{" "}
            <Highlighter action="underline" color="#FF9800">
              credit
            </Highlighter>{" "}
            spent.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link href="/login">
              <Button size="lg" className="" variant={"default"}>
                Start Swapping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="link" className="">
              Explore Marketplace
            </Button>
            
          </div>

          {/* Hero Visual / Dashboard Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <div className="absolute -top-12 -left-12 h-24 w-24 bg-yellow-400 rounded-full blur-2xl opacity-20" />
            <div className="absolute -bottom-12 -right-12 h-32 w-32 bg-blue-600 rounded-full blur-3xl opacity-20" />

            {/* Fixed Typo: 'aspect-video' instead of 'aaspect-video' */}
            <div className="relative rounded-xl overflow-hidden bg-white  border border-slate-100 aspect-video">
              {/* Place a screenshot of your dashboard here later */}
              <div className="absolute inset-0 flex items-center mask-b-from-100% justify-center text-slate-300">
                {/* Mock UI Structure for visual interest if no image yet */}
                <div className="w-full h-full  flex flex-col">
                  <Image
                    src="/dashboard-preview.png"
                    alt="Dashboard Preview"
                    fill
                    className="object-contain"
                  />
                </div>
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full border shadow-sm text-sm font-medium text-slate-500">
                    Interactive Dashboard Preview
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full h-[600px] mx-auto flex items-center justify-center ">
        <BentoFeatures/>
      </section>

      <section className="w-full h-[600px] mx-auto flex items-center justify-center ">
        <HowItWorks/>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold font-display text-neutral-700 dark:text-white mb-6">
            Ready to join the ecosystem?
          </h2>
          <p className="text-lg text-neutral-500 dark:text-white/40 mb-10 max-w-2xl mx-auto">
            Join thousands of students who are trading skills, saving money, and
            building real-world experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full">
                Create Free Account
              </Button>
            </Link>
            <p className="text-sm text-slate-400 mt-4 sm:mt-0">
              No credit card required.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full h-[600px] mx-auto flex items-center justify-center ">
        <MarqueeComponent/>
      </section>

      {/* --- SIMPLE FOOTER --- */}
      <footer className="py-8">
        <Footer/>
      </footer>
    </div>
  );
}
