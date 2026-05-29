"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { successStorySchema, type SuccessStoryValues } from "@/lib/validations/success-story.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { addSuccessStory, updateSuccessStory } from "@/lib/actions/success-story.action";
import { uploadImage } from "@/lib/actions/storage.action";
import { useState, useRef, useEffect } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface SuccessStoryFormProps {
  initialData?: SuccessStoryValues & {
    id: string;
    translations?: {
      locale: string;
      student_name: string;
      destination: string;
      company_name?: string | null;
      testimonial?: string | null;
    }[];
  };
  onSuccess?: () => void;
}

export function SuccessStoryForm({ initialData, onSuccess }: SuccessStoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SuccessStoryValues>({
    resolver: zodResolver(successStorySchema),
    defaultValues: {
      student_name: "",
      destination: "",
      company_name: "",
      testimonial: "",
      image_url: "",
      is_published: true,
    },
  });

  const jaForm = useForm<{
    student_name: string;
    destination: string;
    company_name: string;
    testimonial: string;
  }>({
    defaultValues: {
      student_name: "",
      destination: "",
      company_name: "",
      testimonial: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        student_name: initialData.student_name,
        destination: initialData.destination,
        company_name: initialData.company_name || "",
        testimonial: initialData.testimonial,
        image_url: initialData.image_url,
        is_published: initialData.is_published,
      });

      const ja = initialData.translations?.find((t) => t.locale === "ja");
      if (ja) {
        jaForm.reset({
          student_name: ja.student_name || "",
          destination: ja.destination || "",
          company_name: ja.company_name || "",
          testimonial: ja.testimonial || "",
        });
      }
    }
  }, [initialData, form, jaForm]);

  const imageUrl = form.watch("image_url");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "success-stories");
      const publicUrl = await uploadImage(formData);
      form.setValue("image_url", publicUrl, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: SuccessStoryValues) {
    setLoading(true);
    try {
      const jaValues = jaForm.getValues();
      if (initialData?.id) {
        await updateSuccessStory(initialData.id, values, jaValues);
      } else {
        await addSuccessStory(values, jaValues);
        form.reset();
        jaForm.reset();
      }
      onSuccess?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="student_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Tokyo, Japan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company / Facility Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Sakura Care Center" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="testimonial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testimonial</FormLabel>
              <FormControl>
                <Textarea placeholder="Student's experience..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Japanese Translation */}
        <Form {...jaForm}>
          <div className="rounded-lg border p-4 space-y-4">
            <div className="text-sm font-semibold">Japanese Translation (JA)</div>
            <FormField
              control={jaForm.control}
              name="student_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name (JA)</FormLabel>
                  <FormControl><Input placeholder="例: 山田 太郎" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={jaForm.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination (JA)</FormLabel>
                    <FormControl><Input placeholder="例: 東京都" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={jaForm.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company / Facility (JA)</FormLabel>
                    <FormControl><Input placeholder="例: さくらケアセンター" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={jaForm.control}
              name="testimonial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testimonial (JA)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="体験談..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>

        {/* Photo upload */}
        <div className="space-y-2">
          <p className="text-sm font-medium leading-none">Student Photo</p>
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <div className="relative h-24 w-24 rounded-lg overflow-hidden border">
                <Image src={imageUrl} alt="Student preview" fill sizes="96px" className="object-cover" />
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
                className="h-24 w-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="h-6 w-6 mb-1" />
                    <span className="text-[10px]">Upload Photo</span>
                  </>
                )}
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              title="Upload photo"
              onChange={handleImageUpload}
            />
            <div className="text-xs text-muted-foreground">
              <p>Recommended: Square image (500×500px)</p>
              <p>Max size: 5 MB</p>
            </div>
          </div>
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Published Status</FormLabel>
                <div className="text-[0.8rem] text-muted-foreground">
                  Control if this story is visible on the website.
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Story" : "Add Story"}
        </Button>
      </form>
    </Form>
  );
}
