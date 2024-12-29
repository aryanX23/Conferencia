import { Video, Keyboard } from "lucide-react";

import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  return (
    <>
      <div>
        <Navbar />
        <div className="mt-32 mx-20 flex flex-col gap-10">
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
              <Button>
                <Video />
                New Meeting
              </Button>
              <div className="flex items-center justify-center">
                <Keyboard className="relative left-10" />
                <Input className="pl-12 pr-4 border-black border-2" width={20} placeholder="Enter a code" />
              </div>
              <Button size="lg" variant={"secondary"} className="font-normal" >
                Joinn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
