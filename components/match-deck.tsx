"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Heart, Code2, Briefcase } from "lucide-react"; // Icons
import { processSwipe } from "@/app/dashboard/match/actions";
import { toast } from "sonner";
import Confetti from "react-confetti"; // Optional: npm i react-confetti

interface Profile {
  id: string;
  name: string;
  image: string | null;
  bio?: string; // Add these to your DB schema if you haven't
}

export function MatchDeck({ initialQueue }: { initialQueue: Profile[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [showConfetti, setShowConfetti] = useState(false);

  // Remove card from local state
  const removeCard = (id: string) => {
    setQueue((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSwipe = async (id: string, direction: "left" | "right") => {
    removeCard(id);
    const action = direction === "right" ? "like" : "pass";
    
    // Server Action
    const result = await processSwipe(id, action);

    if (result.isMatch) {
      setShowConfetti(true);
      toast.success("It's a Match! Start chatting!");
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center">
            <Code2 className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold">You've reached the end!</h3>
        <p className="text-slate-500">Check back later for more students.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px] flex items-center justify-center">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      
      <div className="relative w-full h-full">
        <AnimatePresence>
          {queue.map((profile, index) => {
            // Only render the top 2 cards for performance
            if (index > 1) return null;
            const isFront = index === 0;

            return (
              <Card 
                key={profile.id} 
                profile={profile} 
                isFront={isFront}
                onSwipe={(dir) => handleSwipe(profile.id, dir)}
              />
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Controls (visible for accessibility/clicking) */}
      <div className="absolute -bottom-20 flex gap-6">
         <Button 
            size="lg" 
            variant="outline" 
            className="h-14 w-14 rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 shadow-lg"
            onClick={() => handleSwipe(queue[0].id, "left")}
         >
            <X className="h-6 w-6" />
         </Button>
         <Button 
            size="lg" 
            variant="outline" 
            className="h-14 w-14 rounded-full border-green-200 text-green-500 hover:bg-green-50 hover:text-green-600 shadow-lg"
            onClick={() => handleSwipe(queue[0].id, "right")}
         >
            <Heart className="h-6 w-6 fill-current" />
         </Button>
      </div>
    </div>
  );
}

// Sub-component for individual card logic
function Card({ profile, isFront, onSwipe }: { profile: Profile, isFront: boolean, onSwipe: (d: "left" | "right") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Color overlays based on drag
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
        onSwipe("right");
    } else if (info.offset.x < -100) {
        onSwipe("left");
    }
  };

  return (
    <motion.div
      style={{ 
        x: isFront ? x : 0, 
        rotate: isFront ? rotate : 0,
        zIndex: isFront ? 10 : 0,
        scale: isFront ? 1 : 0.96,
        opacity: isFront ? 1 : 0.8 // Fade out back card slightly
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: x.get() < 0 ? -300 : 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-white rounded-3xl shadow-xl border overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {/* Image Area */}
      <div className="h-3/4 bg-slate-200 relative">
        <img 
            src={profile.image || "https://github.com/shadcn.png"} 
            alt={profile.name} 
            className="h-full w-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
        
        {/* Swipe Indicators */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-green-500 rounded-lg px-4 py-2 -rotate-12 z-20">
            <span className="text-3xl font-bold text-green-500 uppercase tracking-widest">Like</span>
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 rotate-12 z-20">
            <span className="text-3xl font-bold text-red-500 uppercase tracking-widest">Nope</span>
        </motion.div>

        <div className="absolute bottom-4 left-4 text-white p-2">
            <h2 className="text-3xl font-bold drop-shadow-md">{profile.name}</h2>
            <p className="text-lg opacity-90">Computer Science • Year 3</p>
        </div>
      </div>

      {/* Details Area */}
      <div className="h-1/4 p-6 bg-white flex flex-col gap-2">
         <div className="flex gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">React</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Design</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Python</span>
         </div>
         <p className="text-slate-500 text-sm line-clamp-2">
            Looking for a frontend developer to help me build the next Orbit feature. I love clean UI and dark mode!
         </p>
      </div>
    </motion.div>
  );
}