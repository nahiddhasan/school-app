"use client";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { login } from "@/lib/actions/login.action";
import { LoginSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const { update } = useSession();
  const callbackUrl = searchParams.get("callbackUrl");

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      try {
        const res = await login(values, callbackUrl);

        if (res.success) {
          await update();
          toast.success(res.success);
        } else {
          toast.error(res.error);
        }
      } catch (err) {
        console.log(err);
        // toast.error("An unexpected error occurred.");
        // setError("An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/img/std.jpg')] bg-cover bg-center text-white">
      <div className="w-full max-w-md bg-zinc-900/75 backdrop-blur-md rounded-lg shadow-lg p-6  py-12">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold">Welcome Back!</h1>
              <p className="text-sm text-gray-400 my-2 mb-2">
                Login to your account
              </p>
            </div>
            <div className="space-y-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email or StudentId"
                placeholder="Enter Your Email or Student Id"
                className="text-black !bg-white"
              />
              <CustomFormField
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter Your Password"
                className="text-black !bg-white"
              />
            </div>
            <Link
              href={"#"}
              className="text-sm text-blue-500 hover:underline py-2"
            >
              Forgot Password?
            </Link>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-green-500 hover:bg-green-600 "
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
            <div className="py-4">
              {urlError && (
                <span className="text-sm rounded-md px-4 py-2 bg-rose-200 text-rose-700 block">
                  {urlError}
                </span>
              )}
              {/* {error && (
                <span className="text-sm rounded-md px-4 py-2 bg-rose-200 text-rose-700 block">
                  {error}
                </span>
              )} */}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
