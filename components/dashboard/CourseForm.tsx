"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, type CourseValues } from "@/lib/validations/course.schema";
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
import { addCourse, updateCourse } from "@/lib/actions/course.action";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CourseFormProps {
  initialData?: CourseValues & { id: string };
  onSuccess?: () => void;
}

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CourseValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      duration: "",
      schedule: "",
      fees: "",
      badge: "",
      is_published: true,
      order_index: 0,
    },
  });

  async function onSubmit(values: CourseValues) {
    setLoading(true);
    try {
      if (initialData?.id) {
        await updateCourse(initialData.id, values);
      } else {
        await addCourse(values);
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Level / Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Japanese N5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the course..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 6 Months" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Morning: 7:00 AM - 9:00 AM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fees</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Rs. 10,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Most Popular" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="order_index"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  value={Number.isNaN(field.value) ? "" : field.value}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    field.onChange(isNaN(val) ? 0 : val);
                  }}
                />
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
                  Control if this course is visible on the website.
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
          {initialData ? "Update Course" : "Add Course"}
        </Button>
      </form>
    </Form>
  );
}
