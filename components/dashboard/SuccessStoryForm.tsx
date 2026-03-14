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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { addSuccessStory, updateSuccessStory } from "@/lib/actions/success-story.action";
import { uploadImage } from "@/lib/actions/storage.action";
import { useState, useRef } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface SuccessStoryFormProps {
  initialData?: SuccessStoryValues & { id: string };
  onSuccess?: () => void;
}

export function SuccessStoryForm({ initialData, onSuccess }: SuccessStoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SuccessStoryValues>({
    resolver: zodResolver(successStorySchema),
    defaultValues: initialData || {
      student_name: "",
      destination_country: "",
      university_name: "",
      testimonial: "",
      image_url: "",
      is_published: true,
    },
  });

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
      form.setValue("image_url", publicUrl, { 
        shouldDirty: true, 
        shouldValidate: true 
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: SuccessStoryValues) {
    setLoading(true);
    try {
      if (initialData?.id) {
        await updateSuccessStory(initialData.id, values);
      } else {
        await addSuccessStory(values);
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
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
            name="destination_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Country</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Japan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="university_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Tokyo University" {...field} />
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
                <Textarea 
                  placeholder="Student's experience..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <Label>Student Photo</Label>
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <div className="relative h-24 w-24 rounded-lg overflow-hidden border">
                <Image src={imageUrl} alt="Student preview" fill className="object-cover" />
                <button 
                  type="button"
                  title="Remove image"
                  onClick={() => form.setValue("image_url", "", { shouldDirty: true, shouldValidate: true })}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm"
                >
                  <X size={12} />
                  <span className="sr-only">Remove image</span>
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
              placeholder="Upload photo"
              onChange={handleImageUpload}
            />
            <div className="text-xs text-muted-foreground">
              <p>Recommended: Square image (500x500px)</p>
              <p>Max size: 5MB</p>
            </div>
          </div>
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
          {initialData ? "Update Story" : "Add Story"}
        </Button>
      </form>
    </Form>
  );
}
