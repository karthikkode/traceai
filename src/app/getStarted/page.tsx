"use client";
import { Button } from "@/components/ui/button";
// import SidebarMobile from "@/components/SidebarMobile";
import SidebarFullScreen from "@/components/SidebarFullScreen";
import TopBar from "@/components/Topbar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFetchUserDetails } from "@/app/hooks/useFetchUserDetails";
import CreateOrganizationModal from "@/components/CreateOrganizationModal";

export default function Getstarted() {
  const { traces, projects, user, organization, loading } =
    useFetchUserDetails();
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session?.status, router]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SidebarFullScreen activeItem="traces" />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* <SidebarMobile /> */}
          <TopBar />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Get Started</h1>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            {!loading && !organization && <CreateOrganizationModal />}
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no journeys
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start tracking journeys as soon as you setup a journey.
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/getstarted/addjourney")}
              >
                Add Journey
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
