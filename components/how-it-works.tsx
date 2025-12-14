"use client";

import { cn } from "@/lib/utils";
import { UserPlus, GraduationCap, ArrowRight } from "lucide-react";
import { UserRoundPlusIcon } from "./ui/user-round-plus";
import { ZapIcon } from "./ui/zap";
import { HandCoinsIcon } from "./ui/hand-coins";

const steps = [
  {
    icon: UserRoundPlusIcon,
    title: "1. List Your Skills",
    description:
      "Create your profile and tell us what you're good at—whether it's Python, Graphic Design, or Calculus.",
    color: "bg-blue-100 text-blue-600",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: ZapIcon,
    title: "2. Earn Credits",
    description:
      "Accept requests from other students. Complete the work to earn Orbit Credits instantly.",
    color: "bg-purple-100 text-purple-600",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: HandCoinsIcon,
    title: "3. Get Help Free",
    description:
      "Use your earned credits to hire help for your own projects. It's a closed-loop economy.",
    color: "bg-indigo-100 text-indigo-600",
    gradient: "from-indigo-500 to-indigo-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/50 blur-3xl rounded-full -rotate-12" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white mb-6">
            The Orbit Ecosystem
          </h2>
          <p className="text-lg text-slate-800 dark:text-slate-200">
            A simple, circular economy designed for students.{" "}
            <br className="hidden md:block" />
            No cash needed—just your skills.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-slate-200 via-slate-200 to-slate-200 -z-10" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Icon Circle */}
              <div className="relative mb-8">
                <div
                  className={cn(
                    "h-24 w-24 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:-translate-y-2 backdrop-blur-sm bg-accent/10 group-hover:shadow-xl",
                    "border border-slate-100"
                  )}
                >
                  {/* Inner Colored Blob */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-10 rounded-2xl transition-all duration-300",
                      step.color.split(" ")[0] // Extracts bg-color class
                    )}
                  />

                  {/* The Icon */}
                  <step.icon
                    className={cn(
                      "h-6 w-6 relative z-10 transition-transform duration-300 group-hover:scale-110",
                      step.color.split(" ")[1]
                    )}
                  />
                </div>

                {/* Number Badge */}
                <div
                  className={cn(
                    "absolute -bottom-3 -right-3 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm border-2 border-white",
                    "bg-linear-to-br",
                    step.gradient
                  )}
                >
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                {step.title.split(". ")[1]}{" "}
                {/* Removes the "1. " for cleaner look */}
              </h3>
              <p className="text-slate-500 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {/* Mobile Arrow (Visual Flow) */}
              {index < steps.length - 1 && (
                <div className="md:hidden mt-8 text-slate-300">
                  <ArrowRight className="h-6 w-6 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
