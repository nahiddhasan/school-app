"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import FullQuillEditor from "@/components/quillEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { pageSchema } from "@/lib/zodSchema";
import { useQuery } from "@tanstack/react-query";

type PageFormValues = z.infer<typeof pageSchema>;

type PageNode = {
  id: string;
  title: string;
  children?: PageNode[];
};

function flattenPages(
  pages: PageNode[],
  depth = 0
): { id: string; title: string }[] {
  return pages.flatMap((page) => {
    const label = `${"— ".repeat(depth)}${page.title}`;
    const current = [{ id: page.id, title: label }];
    const children = page.children
      ? flattenPages(page.children, depth + 1)
      : [];
    return [...current, ...children];
  });
}

export default function UpdatePage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);

  const { data: pageData, isLoading: pageLoading } = useQuery<PageFormValues>({
    queryKey: ["page", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/pages/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch page");
      return res.json();
    },
    enabled: !!params.id,
  });

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      parentId: "",
      isGroupOnly: false,
    },
  });

  useEffect(() => {
    if (pageData) {
      form.reset({
        ...pageData,
        isGroupOnly: !pageData.slug && !pageData.content,
      });
    }
  }, [pageData]);

  const isGroupOnly = form.watch("isGroupOnly");

  const onSubmit = async (values: PageFormValues) => {
    try {
      setLoading(true);

      const payload = values.isGroupOnly
        ? {
            title: values.title,
            parentId: values.parentId || null,
          }
        : {
            title: values.title,
            slug: values.slug,
            content: values.content,
            parentId: values.parentId || null,
          };
      console.log(payload);
      const res = await fetch(`/api/pages/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update page");

      toast.success("Page updated!");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const { data: parentPages } = useQuery<PageNode[]>({
    queryKey: ["pages-tree"],
    queryFn: async () => {
      const res = await fetch("/api/pages/tree");
      if (!res.ok) throw new Error("Failed to fetch pages");
      return res.json();
    },
  });

  return (
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto bg-card rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Update Page</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="title"
            label="Title"
            placeholder="e.g. Services"
          />

          {/* Menu Group Toggle */}
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="isGroupOnly"
            label="Menu Group (No slug/content)"
            disabled={pageData && !pageData.slug && !pageData.content}
          />

          {/* Slug */}
          {!isGroupOnly && (
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="slug"
              label="Slug"
              placeholder="/services/web"
            />
          )}

          {/* Parent Page */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="parentId"
            label="No parent"
            placeholder="Parent Page"
          >
            <SelectItem value="no-value">No parent</SelectItem>
            {flattenPages(parentPages || []).map((page) => (
              <SelectItem key={page.id} value={page.id}>
                {page.title}
              </SelectItem>
            ))}
          </CustomFormField>

          {/* Content */}
          {!isGroupOnly && (
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <FullQuillEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" variant={"secondary"} disabled={loading}>
            {loading ? "Updating..." : "Update Page"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
