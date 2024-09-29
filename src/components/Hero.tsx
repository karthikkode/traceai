"use client";
import Authentication from "./Authentication";
import LoginWithGoogleButton from "@/components/LoginWithGoogleButton";
import LoginWithGithubButton from "@/components/LoginWithGithubButton";

export default function Hero() {
  return (
    <div className="flex flex-col items-center pt-20">
      <div className="text-4xl sm:text-5xl md:text-6xl mb-5 font-bold text-center">
        Trace your users and analyze their behavior
      </div>
      <div className="text-gray-400 text-base sm:text-lg md:text-xl font-bold mb-5 flex flex-col items-center text-center">
        <div className="mb-2">
          TraceAI helps you track, analyze, and understand user interactions on
          your website
        </div>
        <div className="text-foreground mt-4 md:mt-10">
          Trace your users today
        </div>
      </div>

      {/* <Authentication /> */}
      <LoginWithGoogleButton />
      <LoginWithGithubButton />
    </div>
  );
}
