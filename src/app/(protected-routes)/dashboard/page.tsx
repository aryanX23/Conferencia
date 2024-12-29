"use client";

import React from "react";
import { Video, Keyboard, Plus, Link, Calendar } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function CustomCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  const carouselContent = [
    {
      imageUrl: "/assets/carousel-safe.svg",
      heading: <span>Your meeting is safe</span>,
      description: (
        <span>
          No one can join a meeting unless admitted or invited by the host
        </span>
      ),
    },
    {
      imageUrl: "/assets/carousel-calendar.webp",
      heading: <span>Plan your meetings</span>,
      description: (
        <span>
          Plan your meetings ahead of time and send invites via email to
          participants
        </span>
      ),
    },
    {
      imageUrl: "/assets/carousel-connect.webp",
      heading: <span>Uninterrupted Calls</span>,
      description: (
        <span>
          Enjoy high quality and uninterrupted video calls anytime, anywhere
        </span>
      ),
    },
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs mr-32"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {carouselContent.map((content, index) => (
          <CarouselItem key={index}>
            <div className="p-1 w-80 flex flex-col items-center justify-center text-center">
              <Image
                src={content.imageUrl}
                width={400}
                height={400}
                alt="img"
              />
              <span className="font-normal text-3xl text-center">
                {content.heading}
              </span>
              <br />
              <span className="font-light text-xl text-center">
                {content.description}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default function Dashboard() {
  return (
    <>
      <div>
        <Navbar />
        <div className="mt-32 mx-20 flex flex-row gap-10 justify-between">
          <div className="w-2/5 flex flex-col gap-10">
            <div className="left flex flex-col gap-10">
              <span className="text-5xl font-normal">
                Video Calls and Meetings for Everyone
              </span>
              <span className="text-xl font-light text-stone-700">
                Connect, Collaborate and celebrate from anywhere <br />
                with Conferencia
              </span>
            </div>
            <div className="flex flex-row gap-5">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger
                    className="flex gap-5 w-52 items-center justify-center bg-black text-white
                      hover:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200 px-4 py-2"
                  >
                    <Video />
                    New Meeting
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem className="flex gap-5 p-3">
                      <Plus size={20} />
                      Start an Instant Meeting
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled className="flex gap-5 p-3">
                      <Link size={20} />
                      Create a Meeting for later
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled className="flex gap-5 p-3">
                      <Calendar size={20} />
                      Schedule Meeting in Calendar
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>

              <div className="flex items-center justify-center">
                <Keyboard className="relative left-10" />
                <Input
                  className="pl-12 pr-4 border-black border-2"
                  width={20}
                  placeholder="Enter a code"
                />
              </div>
              <Button size="lg" variant={"secondary"} className="font-normal">
                Join
              </Button>
            </div>
          </div>

          <div className="">
            <CustomCarousel />
          </div>
        </div>
      </div>
    </>
  );
}
