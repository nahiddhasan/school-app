"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-full w-full flex-col">
      <span className="">There was a Problem!</span>
      <h2 className="text-3xl mb-4">
        {error.message || "Something went wrong!"}
      </h2>

      <div className=" space-x-4">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Button variant={"secondary"} size={"sm"} onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
