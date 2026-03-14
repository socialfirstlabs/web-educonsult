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
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface SuccessStoryFormProps {
  initialData?: SuccessStoryValues & { id: string };
  onSuccess?: () => void;
}

export function SuccessStoryForm({ initialData, onSuccess }: SuccessStoryFormProps) {
  const [loading, setLoading] = useState(false);

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

  async function onSubmit(values: SuccessStoryValues) {
    setLoading(true);
    try {
      if (initialData?.id) {
        await updateSuccessStory(initialData.id, values);
      } else {
        await addSuccessStory(values);
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
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
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Photo URL</FormLabel>
              <FormControl>
                <Input placeholder="e.g. https://example.com/photo.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
