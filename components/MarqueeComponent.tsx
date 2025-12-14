"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

const reviews = [
  {
    name: "Alex Chen",
    username: "@alx_cs",
    body: "Finally getting help with Calculus without paying $50/hr. I swapped Python tutoring for Math help!",
    img: "https://avatar.vercel.sh/alex",
  },
  {
    name: "Sarah Miller",
    username: "@sarah_designs",
    body: "Built my entire portfolio by creating logos for other students. Orbit is a game changer for creatives.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "James Wilson",
    username: "@j_wilson",
    body: "The study rooms are a lifesaver during finals. Found a solid group to crush Physics with.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Emily Rodriguez",
    username: "@em_rod",
    body: "I love that no cash is involved. I earn credits by editing essays and spend them on guitar lessons.",
    img: "https://avatar.vercel.sh/emily",
  },
  {
    name: "Michael Chang",
    username: "@mike_builds",
    body: "Met my startup co-founder here. We started by swapping marketing tips for coding help.",
    img: "https://avatar.vercel.sh/michael",
  },
  {
    name: "Jessica Park",
    username: "@jess_p",
    body: "Orbit helps me save so much money. It's basically a free economy for students.",
    img: "https://avatar.vercel.sh/jessica",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/10 bg-gray-950/1 hover:bg-gray-950/5",
        // dark styles
        "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-gray-500">{body}</blockquote>
    </figure>
  );
};

export function MarqueeComponent() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background py-10">
      <Marquee pauseOnHover className="[--duration:40s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:40s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      {/* Standard Tailwind Gradients for fading edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-white dark:from-background"></div>
    </div>
  );
}