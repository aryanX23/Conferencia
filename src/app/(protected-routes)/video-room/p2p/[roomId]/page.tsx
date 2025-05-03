"use client";

import React, { useCallback, useEffect, useState } from "react";
import { encode } from "next-auth/jwt";
import { useSession } from "next-auth/react";

import P2PVideoRoom from "@/components/p2p-video-room";
import { SocketProvider } from "@/context/p2p-socket-context";

export default function Page({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = React.use(params);
  const { data: session } = useSession();

  const [token, setToken] = useState<string | null>(null);

  const encodeToken = useCallback(async () => {
    const newToken = await encode({
      /* eslint-disable */
      token: session as any,
      /* eslint-disable */
      secret: process.env.NEXT_PUBLIC_AUTH_SECRET || "",
    });
    setToken(newToken);
  }, []);

  useEffect(() => {
    encodeToken();
  }, [encodeToken]);

  return (
    <SocketProvider namespace="/rtc/p2p/" roomId={roomId} token={token}>
      <P2PVideoRoom roomId={roomId} />
    </SocketProvider>
  );
}
