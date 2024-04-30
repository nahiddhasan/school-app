"use client";

import { login } from "@/lib/actions";
import { LoginSchema } from "@/lib/zodSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values, callbackUrl).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
      });
    });
  };
  return (
    <div className="flex items-center justify-end  h-full w-full bg-[url('/img/std.jpg')] bg-cover text-white">
      <div className="w-[35%] h-full flex gap-2 justify-between  bg-zinc-900/75 backdrop-blur-sm overflow-hidden ">
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col justify-center p-2"
        >
          <h1 className="text-3xl text-center mb-4">Log in</h1>
          <div className="px-5 ">
            <input
              type="email"
              placeholder="Enter Your Email"
              {...register("email")}
              className={`w-full p-2 px-0 bg-transparent outline-none border-b ${
                errors.email ? "border-rose-500" : "border-zinc-300"
              }`}
            />
            {errors.email && (
              <span className="text-rose-500">{errors.email.message}</span>
            )}
            <input
              type="password"
              placeholder="********"
              {...register("password")}
              className={`w-full p-2 px-0 bg-transparent outline-none border-b ${
                errors.email ? "border-rose-500" : "border-zinc-300"
              }`}
            />
            {errors.password && (
              <span className="text-rose-500">{errors.password.message}</span>
            )}
            {error && <span className="text-rose-500">{error}</span>}
            <button
              disabled={isPending}
              className={`disabled:cursor-not-allowed w-full p-2 px-4 bg-green-700 hover:bg-green-700/80 transition-all  my-4 rounded-full`}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
