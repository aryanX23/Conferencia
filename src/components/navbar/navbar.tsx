"use client";

import Image from "next/image";
import * as React from "react";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import Clock from "@/components/clock/clock";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const components: { title: string; description: string; action: Function }[] = [
  {
    title: "Sign Out",
    description: "Return to the Home Screen",
    action: async function action() {
      await signOut();
    },
  },
];

function CustomNavigationMenu() {
  const { data: session } = useSession();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-lg flex gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Badge className="text-base text-foreground" variant="secondary">
              {session?.user?.userName || "User"}
            </Badge>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-48 p-1 flex-col">
              {components.map((component) => (
                <React.Fragment key={component.title}>
                  <ListItem
                    title={component.title}
                    onClick={() => component?.action()}
                  >
                    {component?.description}
                  </ListItem>
                  <div className="relative py-0.5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-b border-gray-300"></div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            `block select-none space-y-1 rounded-md p-3 leading-none no-underline
            outline-none transition-colors hover:bg-accent hover:text-accent-foreground
            focus:bg-accent focus:text-accent-foreground`,
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Navbar() {
  return (
    <nav className="w-full h-20 flex items-center justify-between gap-5 px-16">
      <div>
        <Image src="/logos/AppLogo.png" alt="logo" width={300} height={300} />
      </div>
      <div className="flex gap-7 items-center justify-center">
        <Clock />
        <Settings size={30} />
        <CustomNavigationMenu />
      </div>
    </nav>
  );
}
