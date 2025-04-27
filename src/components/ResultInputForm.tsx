"use client";

import { getResult } from "@/lib/actions";
import { Class, Result, Session } from "@/lib/types";
import { getResultSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ResultView from "./ResultView";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type props = {
  session: Session[];
  classes: Class[];
  response?: string;
};

type resultDataType = {
  messege: string;
  result?: Result | undefined;
};

const ResultInputForm = ({ classes, session }: props) => {
  const [resultData, setResultData] = useState<resultDataType>();

  const form = useForm<z.infer<typeof getResultSchema>>({
    resolver: zodResolver(getResultSchema),
  });
  // onsubmit function
  const onSubmit = async (values: z.infer<typeof getResultSchema>) => {
    const res = await getResult(
      values.studentId,
      values.session,
      values.className,
      values.exam
    );

    //TODO: can not solve the type problem latter need to try resolve again

    //@ts-ignore
    setResultData(res);
  };

  if (resultData?.messege === "success") {
    return <ResultView result={resultData?.result} />;
  } else {
    return (
      <div className="flex items-center justify-center bg-zinc-100 text-zinc-800 p-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-3/4 space-y-2"
          >
            <FormField
              control={form.control}
              name="session"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Year</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(+value)}
                    //TODO: type check letter
                    //@ts-ignore
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Exam Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {session.map((sess) => (
                        <SelectItem key={sess.id} value={String(sess.year)}>
                          {sess.year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.className}>
                          {cls.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Exam Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Annual">Annual</SelectItem>
                      <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>StudentId</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your StudentId"
                      type="number"
                      {...field}
                      defaultValue={field.value}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {resultData?.messege && (
              <span className="text-sm text-red-500 font-semibold bg-red-100 rounded-sm px-2">
                {resultData?.messege}
              </span>
            )}

            <div className="space-x-2">
              <Button type="submit" variant={"outline"} size={"sm"}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }
};

export default ResultInputForm;
