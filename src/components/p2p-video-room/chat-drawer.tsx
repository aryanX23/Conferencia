"use client";
import { useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

import { useSocket } from "@/context/p2p-socket-context";

export default function ChatDrawer(props: { roomId: string }) {
  const { roomId } = props;
  const socket = useSocket();

  const [messages, setMessages] = useState<
    { text: string; sender: "me" | "other" }[]
  >([{ text: "Hello! Welcome to the chat.", sender: "other" }]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket?.on("receive-message", (message) => {
      setMessages((prev) => [...prev, { text: message, sender: "other" }]);
    });

    return () => {
      socket?.off("receive-message");
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket?.emit("send-message", { roomId, newMessage });
      setMessages((prev) => [...prev, { text: newMessage, sender: "me" }]);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Chat</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>In Call Chat</SheetTitle>
          <SheetDescription>
            Messages in the chat are temporary and will be wiped out once the
            call ends
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto my-4 pr-2 h-[calc(100vh-220px)]">
          <div className="flex flex-col gap-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                message.sender === "me"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input area */}
        <SheetFooter className="flex-row gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
