"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dropzone } from "@/components/ui/dropzone";
import { uploadImage } from "@/lib/actions";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export function PhotoUploadModal() {
  const [open, setOpen] = useState(false);

  const [images, setImages] = useState<{ file: File; title: string }[]>([]);

  const addPhotosToDB = async (
    uploadedData: { url: string | undefined; title: string }[]
  ) => {
    const res = await fetch("/api/school/manage/gallary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: uploadedData }),
    });

    if (!res.ok) {
      throw new Error("Failed to add photos to database");
    }
    return true;
  };

  const mutation = useMutation({
    mutationFn: addPhotosToDB,
    onSuccess: () => {
      toast.success("Photos uploaded successfully!");
      setImages([]);
      setOpen(false);
    },
    onError: () => {
      toast.error("Error uploading photos to database");
    },
  });

  const handleUpload = async () => {
    if (images.length === 0) {
      toast.error("No images selected");
      return;
    }

    const missingTitles = images.filter((img) => !img.title.trim());
    if (missingTitles.length > 0) {
      toast.error("Please provide a title for every image.");
      return;
    }

    try {
      const uploadedData: { url: string | undefined; title: string }[] = [];

      for (const { file, title } of images) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadImage(formData); // must return { url }
        uploadedData.push({ url: res.url, title });
      }

      mutation.mutate(uploadedData);
    } catch (error) {
      toast.error("Failed to upload photos");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Plus
          size={32}
          className="bg-zinc-300 dark:bg-zinc-700 p-1 rounded-full cursor-pointer hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-all duration-200"
        />
      </DialogTrigger>

      <DialogContent className="min-w-[50%] w-full">
        <DialogHeader>
          <DialogTitle>Upload a Photo</DialogTitle>
        </DialogHeader>

        <Dropzone
          onChange={(files) =>
            setImages(files.map((file) => ({ file, title: "" })))
          }
          maxFiles={5}
          multiple
          fileExtension="jpg"
        />

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative space-y-2">
                <Image
                  src={URL.createObjectURL(img.file)}
                  alt={`Image ${idx + 1}`}
                  height={150}
                  width={150}
                  className="object-cover rounded w-full h-[150px]"
                />
                <input
                  type="text"
                  value={img.title}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[idx].title = e.target.value;
                    setImages(newImages);
                  }}
                  placeholder="Enter title"
                  className="w-full text-sm px-2 py-1 rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white dark:bg-zinc-800 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition-colors"
                  onClick={() => {
                    setImages((prev) => prev.filter((_, i) => i !== idx));
                  }}
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={mutation.isPending}
          type="button"
          variant="secondary"
          className="mt-6"
        >
          {mutation.isPending ? "Uploading..." : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
