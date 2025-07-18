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

type PageFormValues = z.infer<typeof pageSchema>;

// --- Types for page tree ---
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

export default function CreatePage() {
  const [parentPages, setParentPages] = useState<PageNode[]>([]);
  const [loading, setLoading] = useState(false);

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

  const isGroupOnly = form.watch("isGroupOnly");

  const onSubmit = async (values: PageFormValues) => {
    try {
      setLoading(true);
      const res = await fetch("/api/pages", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          slug: values.isGroupOnly ? null : values.slug,
          content: values.isGroupOnly ? null : values.content,
        }),
      });

      if (!res.ok) throw new Error("Failed to create page");

      form.reset();
      toast.success("Page created!");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPages = async () => {
      const res = await fetch("/api/pages/tree");
      const data: PageNode[] = await res.json();
      setParentPages(data);
    };
    fetchPages();
  }, []);

  return (
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto bg-card rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Create New Page</h2>
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
          />

          {/* Slug (hidden if group) */}
          {!isGroupOnly && (
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="slug"
              label="Slug"
              placeholder="/services/web"
            />
          )}

          {/* Parent Page Dropdown */}
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

          {/* Content (hidden if group) */}
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
            {loading ? "Creating..." : "Create Page"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
