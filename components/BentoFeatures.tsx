import React from 'react';
import { 
  LibraryBig, 
  UsersRound, 
  ArrowRightLeft, 
  Coins, 
  Sparkles,
  BrainCircuit,
  MessageCircleHeart
} from 'lucide-react';

const BentoFeatures = () => {
  return (
    <section className="py-10 px-4 ">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to grow.
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Unlock your potential with our integrated ecosystem designed for learning, sharing, and earning.
          </p>
        </div>

        {/* The Grid Container */}
        {/* We use auto-rows to ensure a minimum height for tiles, allowing row-spans to work effectively */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-4">
          
          {/* Tile 1: Swap Skills Market (Hero Tile - Large Square) */}
          <div className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 md:col-span-2 md:row-span-2 flex flex-col justify-between transition-all hover:shadow-xl">
            {/* Decorative background gradient */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-[300px] w-[300px] rounded-full bg-linear-to-br from-purple-500/20 to-blue-500/20 blur-3xl" />
            
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <ArrowRightLeft size={24} />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Swap Skills Market
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-sm leading-relaxed">
                Trade your expertise for someone else's. Teach design to learn coding. A true peer-to-peer economy based on knowledge, not just cash.
              </p>
            </div>
             {/* Decorative icon for visual interest */}
            <div className="absolute bottom-4 right-4 text-purple-200/50 dark:text-purple-900/20 transition-transform group-hover:scale-110 duration-500">
              <BrainCircuit size={120} />
            </div>
          </div>

          {/* Tile 2: Study Room (Wide Rectangle) */}
          <div className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 md:col-span-2 transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent dark:from-blue-950/30 opacity-50" />
            <div className="relative flex items-start gap-4">
               <div className="inline-flex shrink-0 h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <LibraryBig size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Virtual Study Room <Sparkles size={16} className="text-yellow-500 animate-pulse"/>
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Join focused quiet zones or collaborative group sessions. Co-work virtually and boost your productivity.
                </p>
              </div>
            </div>
          </div>

          {/* Tile 3: Community (Small Square) */}
          <div className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 transition-all hover:shadow-lg md:col-span-1">
             <div className="absolute top-0 left-0 -ml-10 -mt-10 h-32 w-32 rounded-full bg-linear-to-br from-green-500/20 to-teal-500/20 blur-2xl" />
            <div className="relative h-full flex flex-col justify-between">
               <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <UsersRound size={20} />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                  Vibrant Community
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Connect with peers, find mentors, and join specialized interest groups.
                </p>
              </div>
               <MessageCircleHeart size={64} className="absolute -bottom-6 -right-6 text-green-100 dark:text-green-900/30 group-hover:rotate-12 transition-transform"/>
            </div>
          </div>

           {/* Tile 4: Using Credits (Small Square) */}
          <div className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6 transition-all hover:shadow-lg md:col-span-1">
            <div className="relative h-full flex flex-col justify-between">
               <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 shadow-sm">
                <Coins size={20} />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                  Credit System
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Earn credits by teaching and spend them to unlock premium sessions or tools.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;