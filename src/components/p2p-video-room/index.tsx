"use client";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSocket } from "@/context/p2p-socket-context";
import { Button } from "@/components/ui/button";
import ChatDrawer from "@/components/p2p-video-room/chat-drawer";

export default function P2PVideoRoom(props: { roomId: string }) {
  const { roomId } = props;
  
  const socket = useSocket();
  const router = useRouter();

  const disconnectCall = useCallback(() => {
    socket?.emit("leave-room", { roomId });
    router.replace("/dashboard");
  }, [socket, router, roomId]);

  useEffect(() => {
    socket?.on("disconnect", disconnectCall);
  }, [disconnectCall, socket]);

  return (
    <div className="flex flex-col gap-2 m-10">
      <div>P2PVideoRoom</div>
      <div className="flex gap-2">
        <Button onClick={disconnectCall}>Leave Call</Button>
      </div>
      <ChatDrawer roomId={roomId} />
    </div>
  );
}
