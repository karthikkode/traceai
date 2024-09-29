"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginWithGoogleButton from "@/components/LoginWithGoogleButton";

// Define Zod Schemas for validation
const registerSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function Authentication() {
  const router = useRouter();
  const [userExistsMessage, setUserExistsMessage] = useState<null | string>(
    null
  );

  // React Hook Form setup
  const {
    register: registerRegisterForm,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: registerLoginForm,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Handle form submissions
  const onRegisterSubmit = async (data: any) => {
    // try {
    //   const response = await axios.post("/api/user/create", data);
    //   if (response.data) {
    //     return response.data;
    //   }
    // } catch (error: any) {
    //   if (error.response) {
    //     if (
    //       error.response.data.message === "User with this email already exists"
    //     ) {
    //       setUserExistsMessage(error.response.data.message);
    //       setTimeout(() => {
    //         setUserExistsMessage(null);
    //       }, 2000);
    //     } else {
    //       setUserExistsMessage(error.response.data.message);
    //       setTimeout(() => {
    //         setUserExistsMessage(null);
    //       }, 2000);
    //     }
    //   } else {
    //     setUserExistsMessage("An unexpected error occurred");
    //     setTimeout(() => {
    //       setUserExistsMessage(null);
    //     }, 2000);
    //   }
    // }
    console.log("hi");
    await signIn("resend", {
      email: data.email,
    });
  };

  const onLoginSubmit = async (data: any) => {
    // const signInData = await signIn("credentials", {
    //   email: data.email,
    //   password: data.password,
    //   redirect: false,
    // });
    // console.log("hi");
    // console.log(signInData);
    // // Check if login was successful
    // console.log(signInData?.error !== null);
    // if (signInData?.error === null) {
    //   // Redirect to the getStarted page
    //   router.push("/getStarted");
    // } else {
    //   // Handle login failure (optional: show an error message)
    //   console.log("Login failed:", signInData?.error);
    // }
    console.log("hi");
    await signIn("resend", {
      email: data.email,
    });
  };

  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Register</TabsTrigger>
        <TabsTrigger value="password">Log In</TabsTrigger>
      </TabsList>

      {/* Register Form */}
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Please enter below details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleSubmitRegister(onRegisterSubmit)}>
              <div className="space-y-1">
                <Label htmlFor="username">User Name</Label>
                <Input
                  id="username"
                  placeholder="Pedro Duarte"
                  {...registerRegisterForm("username")}
                />
                {registerErrors.username?.message && (
                  <p className="text-red-500">
                    {typeof registerErrors.username.message === "string"
                      ? registerErrors.username.message
                      : "Invalid input"}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="example@traceai.com"
                  {...registerRegisterForm("email")}
                />
                {registerErrors.email?.message && (
                  <p className="text-red-500">
                    {typeof registerErrors.email.message === "string"
                      ? registerErrors.email.message
                      : "Invalid input"}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerRegisterForm("password")}
                />
                {registerErrors.password?.message && (
                  <p className="text-red-500">
                    {typeof registerErrors.password.message === "string"
                      ? registerErrors.password.message
                      : "Invalid input"}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className={`w-full mt-4 ${
                  userExistsMessage ? "text-red-500" : ""
                }`}
              >
                {userExistsMessage ? userExistsMessage : "Register"}
              </Button>
            </form>

            <CardFooter className="flex flex-col gap-2 mt-4 p-0">
              <div className="flex gap-2 w-full">
                <div className="flex-1">
                  <LoginWithGoogleButton />
                </div>
                <Button className="flex-1" disabled>
                  Continue as Guest
                </Button>
              </div>
            </CardFooter>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Login Form */}
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Please enter below details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleSubmitLogin(onLoginSubmit)}>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="example@traceai.com"
                  {...registerLoginForm("email")}
                />
                {loginErrors.email?.message && (
                  <p className="text-red-500">
                    {typeof loginErrors.email.message === "string"
                      ? loginErrors.email.message
                      : "Invalid input"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerLoginForm("password")}
                />
                {loginErrors.password?.message && (
                  <p className="text-red-500">
                    {typeof loginErrors.password.message === "string"
                      ? loginErrors.password.message
                      : "Invalid input"}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full mt-4">
                Login
              </Button>
            </form>
            <CardFooter className="flex flex-col gap-2 mt-4 p-0">
              <div className="flex gap-2 w-full">
                <div className="flex-1">
                  <LoginWithGoogleButton />
                </div>
                <Button className="flex-1" disabled>
                  Continue as Guest
                </Button>
              </div>
            </CardFooter>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
