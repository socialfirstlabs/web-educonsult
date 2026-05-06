"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, type BlogValues } from "@/lib/validations/blog.schema";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog.action";
import { uploadImage } from "@/lib/actions/storage.action";
import { useState, useRef, useEffect } from "react";
import { Loader2, ImagePlus, X, Wand2 } from "lucide-react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

interface BlogFormProps {
  initialData?: BlogValues & {
    id: string;
    translations?: {
      locale: string;
      title: string;
      slug: string;
      excerpt?: string | null;
      content: string;
    }[];
  };
  onSuccess?: () => void;
  currentUser?: User | null;
}

export function BlogForm({ initialData, onSuccess, currentUser }: BlogFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BlogValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      author_name: currentUser?.user_metadata?.full_name || currentUser?.email || "EduNepal Team",
      excerpt: "",
      content: "",
      image_url: "",
      is_published: false,
    },
  });

  const jaForm = useForm<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
  }>({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        slug: initialData.slug,
        author_name: initialData.author_name || "EduNepal Team",
        excerpt: initialData.excerpt || "",
        content: initialData.content,
        image_url: initialData.image_url || "",
        is_published: initialData.is_published,
        published_at: initialData.published_at || "",
      });

      const ja = initialData.translations?.find((t) => t.locale === "ja");
      if (ja) {
        jaForm.reset({
          title: ja.title || "",
          slug: ja.slug || "",
          excerpt: ja.excerpt || "",
          content: ja.content || "",
        });
      }
    }
  }, [initialData, form, jaForm]);

  const imageUrl = form.watch("image_url");

  const generateSlug = () => {
    const title = form.getValues("title");
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    form.setValue("slug", slug, { shouldValidate: true });
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");
      
      const publicUrl = await uploadImage(formData);
      form.setValue("image_url", publicUrl, { 
        shouldDirty: true, 
        shouldValidate: true 
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: BlogValues) {
    setLoading(true);
    try {
      const jaValues = jaForm.getValues();
      if (initialData?.id) {
        await updateBlogPost(initialData.id, values, jaValues);
      } else {
        await createBlogPost(values, jaValues);
        form.reset();
        jaForm.reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. How to Study in Japan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="author_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. EduNepal Team" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Slug (URL Path)
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={generateSlug}
                  className="h-6 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" /> Generate from title
                </Button>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. how-to-study-in-japan" {...field} />
              </FormControl>
              <FormDescription>The URL will be: /blog/{"{slug}"}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt (Summary)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A short summary of the post..." 
                  className="h-20 resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (HTML/Text)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="The main body of your post..." 
                  className="h-60" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Form {...jaForm}>
          <div className="rounded-lg border p-4 space-y-4">
            <div className="text-sm font-semibold">Japanese Translation (JA)</div>
            <FormField
              control={jaForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title (JA)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Nihon ryugaku no hajimekata" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={jaForm.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (JA)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. nihon-ryugaku-start" {...field} />
                  </FormControl>
                  <FormDescription>
                    The localized URL will be: /blog/{"{slug}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={jaForm.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt (JA)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short summary in Japanese..."
                      className="h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={jaForm.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (JA)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full content in Japanese..."
                      className="h-60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
        
        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <div className="relative h-24 w-40 rounded-lg overflow-hidden border">
                <Image src={imageUrl} alt="Featured image preview" fill className="object-cover" />
                <button 
                  type="button"
                  title="Remove image"
                  onClick={() => form.setValue("image_url", "", { shouldDirty: true, shouldValidate: true })}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="h-24 w-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="h-6 w-6 mb-1" />
                    <span className="text-xs">Upload Image</span>
                  </>
                )}
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              title="Upload featured image"
              placeholder="Upload featured image"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Published Status</FormLabel>
                <div className="text-[0.8rem] text-muted-foreground">
                  Draft posts are not visible to the public.
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Post" : "Create Post"}
        </Button>
      </form>
    </Form>
  );
}
