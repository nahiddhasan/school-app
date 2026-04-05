"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Highlight } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  highlight: Highlight;
};

const EditableHighlightCard = ({ highlight }: Props) => {
  const [title, setTitle] = useState(highlight.title);
  const [description, setDescription] = useState(highlight.description);
  const [editingField, setEditingField] = useState<
    "title" | "description" | null
  >(null);

  const mutation = useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      description: string;
    }) => {
      const res = await fetch(`/api/school/manage/highlight`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update highlight");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Highlight updated successfully");
      setEditingField(null);
    },
    onError: () => {
      toast.error("Failed to update highlight");
    },
  });

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    const isUnchanged =
      trimmedTitle === highlight.title &&
      trimmedDescription === highlight.description;

    if (isUnchanged) {
      setEditingField(null);
      return;
    }

    mutation.mutate({
      id: highlight.id,
      title: trimmedTitle,
      description: trimmedDescription,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent newline in textarea
      (e.target as HTMLElement).blur(); // trigger onBlur
    }
  };

  return (
    <Card className="p-4 transition">
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
      <div className="mt-2">
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

export default EditableHighlightCard;
