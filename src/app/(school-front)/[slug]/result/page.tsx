"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ExamType } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resultSchema } from "@/lib/zodSchema";
import { useQuery } from "@tanstack/react-query";

type FormValues = z.infer<typeof resultSchema>;
// Fetch classes from API
async function fetchClasses() {
  const res = await fetch("/api/classes");
  if (!res.ok) throw new Error("Failed to fetch classes");
  return res.json();
}

// Fetch years from API
async function fetchYears() {
  const res = await fetch("/api/academic-years");
  if (!res.ok) throw new Error("Failed to fetch years");
  return res.json();
}

export default function SearchResultPage() {
  const [result, setResult] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  const { data: classesData, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(resultSchema),
  });

  async function onSubmit(values: FormValues) {
    setResult(null);
    setNotFound(false);
    try {
      //TODO: need to make api to fetch result for public
      const res = await fetch("/api/search-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error(error);
      setNotFound(true);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search Student Result</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* select class */}
          <FormField
            control={form.control}
            name="className"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Class</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classesData?.map((cls) => (
                        <SelectItem key={cls.id} value={cls.className}>
                          {cls.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Year */}
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Academic Year"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Exam Type */}
          <FormField
            control={form.control}
            name="examType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ExamType).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {key
                            .replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Student ID */}
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter student id"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Search
          </Button>
        </form>
      </Form>

      {result && (
        <div className="mt-6 border rounded-lg p-4 bg-muted">
          <h2 className="text-xl font-semibold mb-2">Result Details</h2>
          <p>
            <strong>GPA:</strong> {result.gpa ?? "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {result.status}
          </p>
          <p>
            <strong>Total Marks:</strong> {result.totalMarks}
          </p>
          <p>
            <strong>Position:</strong> {result.position ?? "N/A"}
          </p>
          <p>
            <strong>Subjects:</strong> {JSON.stringify(result.subjects)}
          </p>
        </div>
      )}

      {notFound && (
        <p className="text-red-500 mt-4 font-semibold">
          No result found for the given input.
        </p>
      )}
    </div>
  );
}
