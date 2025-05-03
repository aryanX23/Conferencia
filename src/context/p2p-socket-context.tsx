"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({
  children,
  namespace,
  roomId,
  token,
}: {
  children: React.ReactNode;
  namespace: string;
  roomId: string;
  token: string | null;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const url = process.env.NEXT_PUBLIC_RTC_ENGINE_BASE_URL + namespace;

  useEffect(() => {
    if (!token) return;

    const newSocket = io(url, {
      auth: {
        token,
      },
    });
    newSocket.on("connect", () => {
      newSocket.emit("join-room", { roomId });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url, roomId, token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
