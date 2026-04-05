"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facility } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  facility: Facility;
};

const EditableFacilityCard = ({ facility }: Props) => {
  const [title, setTitle] = useState(facility.title);
  const [description, setDescription] = useState(facility.description);
  const [imageUrl, setImageUrl] = useState(facility.imageUrl || "");
  const [editingField, setEditingField] = useState<
    "title" | "description" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log(imageUrl.toString());
  const mutation = useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      description: string;
      imageUrl?: string;
    }) => {
      const res = await fetch(`/api/school/manage/facility`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update facility");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Facility updated successfully");
      setEditingField(null);
    },
    onError: () => {
      toast.error("Failed to update facility");
    },
  });

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedImageUrl = imageUrl.trim();

    const isUnchanged =
      trimmedTitle === facility.title &&
      trimmedDescription === facility.description &&
      trimmedImageUrl === (facility.imageUrl ?? "");

    if (isUnchanged) {
      setEditingField(null);
      return;
    }

    mutation.mutate({
      id: facility.id,
      title: trimmedTitle,
      description: trimmedDescription,
      imageUrl: trimmedImageUrl,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  const handleImageEdit = () => {
    const url = prompt("Enter image URL", imageUrl || "");
    if (url !== null) {
      setImageUrl(url);
      mutation.mutate({
        id: facility.id,
        title,
        description,
        imageUrl: url,
      });
    }
  };

  return (
    <Card className="p-4 transition relative space-y-3">
      {/* Image with edit icon */}
      <div className="relative w-full h-40 rounded-md overflow-hidden bg-muted">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        <button
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
          onClick={handleImageEdit}
          type="button"
        >
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Title Field */}
      <div>
        {editingField === "title" ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            disabled={mutation.isPending}
            autoFocus
            className="text-xl p-0 border-none font-semibold outline-none bg-transparent"
          />
        ) : (
          <h3
            className="text-xl font-semibold cursor-pointer"
            onClick={() => setEditingField("title")}
          >
            {title}
          </h3>
        )}
      </div>

      {/* Description Field */}
      <div>
        {editingField === "description" ? (
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            disabled={mutation.isPending}
            autoFocus
            className="p-0 bg-transparent resize-none border-none outline-none text-sm text-muted-foreground"
          />
        ) : (
          <p
            className="text-sm text-muted-foreground cursor-pointer"
            onClick={() => setEditingField("description")}
          >
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default EditableFacilityCard;
