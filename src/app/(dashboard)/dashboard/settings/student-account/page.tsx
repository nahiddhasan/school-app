"use client";

import { Button } from "@/components/ui/button";
import { createUsersFromStudents } from "@/lib/actions";
import { useTransition } from "react";
import { toast } from "sonner";

const StudentAccount = () => {
  const [isPending, startTransition] = useTransition();

  const handleGenerateAccounts = () => {
    startTransition(async () => {
      try {
        const res = await createUsersFromStudents();
        if (res.success) {
          toast.success(res.success);
        } else {
          toast.error(res.error);
        }
      } catch (error) {
        console.error("Error generating student accounts:", error);
        toast.error("Failed to generate student accounts.");
      }
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-semibold mb-3">
          Create Student Account From Student Lists
        </h1>
        <p className="text-muted-foreground">
          Only creates student account if the student doesn&apos;t already have
          one.
        </p>
      </div>
      <Button
        disabled={isPending}
        variant={"secondary"}
        onClick={handleGenerateAccounts}
      >
        Generate Student Accounts
      </Button>
    </div>
  );
};

export default StudentAccount;
