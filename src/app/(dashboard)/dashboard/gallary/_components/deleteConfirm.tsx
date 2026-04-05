"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";

const DeleteConfirm = ({ id }: { id: string }) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/school/manage/gallary/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res;
    },
    onSuccess: () => {
      toast.success("Delete Successfull");
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
        <X className="text-red-500" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete image
            from servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirm;
