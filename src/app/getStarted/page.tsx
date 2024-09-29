import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import React from "react";
import Logout from "@/components/LogoutButton";
export default async function () {
  const session = await auth();

  if (!session?.user) redirect("/");
  console.log(session?.user?.email);
  return (
    <div>
      {session?.user?.email}
      <Logout />
    </div>
  );
}
