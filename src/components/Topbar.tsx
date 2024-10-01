"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser } from "lucide-react";
import { useFetchUserDetails } from "@/app/hooks/useFetchUserDetails";
import { GrOrganization } from "react-icons/gr";
import { useContext } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

export default function TopBar() {
  const { traces, projects, user, organization, loading } =
    useFetchUserDetails();
  return (
    <>
      <div className="w-full flex-1"></div>
      <div className="flex justify-content items-center gap-4">
        <div>
          <div className="items-center flex justify-content gap-2 p-1">
            <GrOrganization className="h-4 w-4" />
            {!loading && organization && organization.name}
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src="https://lh3.googleusercontent.com/a/ACg8ocIgeiqCdnIxG64D2E8lcz8qv5a4581wVsjsoK_WK7pZ4MD4AQ=s96-c"
                  alt="@shadcn"
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{!loading && user.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
