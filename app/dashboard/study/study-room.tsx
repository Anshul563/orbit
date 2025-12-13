"use client";

import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getToken } from "./actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function StudyRoom({ room }: { room: string }) {
  const [token, setToken] = useState("");
  const [topic, setTopic] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { token: t, topic: roomTopic } = await getToken(room);
        setToken(t);
        setTopic(roomTopic);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [room]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500">Connecting to {room}...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] w-full bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
      <div className="bg-slate-900 p-2 flex justify-between items-center px-4">
        <span className="text-white font-medium">Study Room: {topic}</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => router.push("/dashboard/study")}
        >
          Leave Room
        </Button>
      </div>

      {/* The LiveKit Room Context */}
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        className="flex-1"
        onDisconnected={() => router.push("/dashboard/study")}
      >
        <MyVideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}

// Custom layout wrapper if you want to customize later,
// otherwise standard VideoConference works great.
function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout tracks={tracks} style={{ height: "calc(100% - 60px)" }}>
      <ParticipantTile />
    </GridLayout>
  );
}
