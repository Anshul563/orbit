"use client";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  DisconnectButton,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { Loader2, PhoneOff } from "lucide-react";
import { getCallToken } from "./actions";

interface CallInterfaceProps {
  swapId: string;
  video: boolean;
  onLeave: () => void;
}

export function CallInterface({ swapId, video, onLeave }: CallInterfaceProps) {
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const t = await getCallToken(swapId);
        setToken(t);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [swapId]);

  if (!token) {
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center text-white backdrop-blur-sm">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
        <p>Securing connection...</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col">
       {/* Custom Header to allow exiting without fully destroying room if needed */}
       <div className="absolute top-4 right-4 z-[60]">
         <button 
           onClick={onLeave}
           className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition"
         >
            <PhoneOff className="h-6 w-6" />
         </button>
       </div>

      <LiveKitRoom
        video={video}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        className="flex-1 h-full"
        onDisconnected={onLeave}
      >
        <VideoConference />
        <RoomAudioRenderer />
        {/* We use the default VideoConference UI which includes controls, 
            but you can customize using <ControlBar /> explicitly if needed */}
      </LiveKitRoom>
    </div>
  );
}