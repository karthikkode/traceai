"use client";
import Link from "next/link";
import {
  Bell,
  Lightbulb,
  LineChart,
  LayoutDashboard,
  Package2,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useFetchUserDetails } from "@/app/hooks/useFetchUserDetails";

interface SidebarFullScreenProps {
  activeItem:
    | "dashboard"
    | "getstarted"
    | "users"
    | "analytics"
    | "userJourneys"
    | "settings";
}

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DropdownMenuRadioGroupDemo = () => {
  const [position, setPosition] = React.useState("bottom");
  const { traces, projects, user, organization, loading } =
    useFetchUserDetails();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-content items-center gap-1 text-xl">
          Projects <IoIosArrowDropdownCircle />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {!loading &&
            projects.map((item: any) => (
              <DropdownMenuRadioItem key={item.id} value={item.name}>
                {item.name}
              </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function SidebarFullScreen({
  activeItem,
}: SidebarFullScreenProps) {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Trace AI</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-muted-foreground hover:text-primary cursor-pointer">
              <Avatar className="h-12 w-12 bg-blue-800 flex items-center justify-center">
                <AvatarFallback className="text-white text-2xl font-bold">
                  {"HI"}
                </AvatarFallback>
              </Avatar>
              <DropdownMenuRadioGroupDemo />
            </div>
            <Link
              href="/getstarted"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeItem === "getstarted"
                  ? "bg-muted"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeItem === "dashboard"
                  ? "bg-muted"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/userJourneys"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeItem === "userJourneys"
                  ? "bg-muted"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Users className="h-4 w-4" />
              Users Journeys
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeItem === "settings"
                  ? "bg-muted"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
