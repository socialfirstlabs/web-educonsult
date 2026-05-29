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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addCourse, updateCourse } from "@/lib/actions/course.action";
import { uploadImage } from "@/lib/actions/storage.action";
import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface CourseFormProps {
  initialData?: CourseValues & {
    id: string;
    translations?: {
      locale: string;
      title: string;
      description: string;
      duration?: string | null;
      schedule?: string | null;
      fees?: string | null;
      badge?: string | null;
    }[];
  };
  onSuccess?: () => void;
}

const EMOJI_OPTIONS = [
  { label: "Shield",        value: "🛡️" },
  { label: "Star",          value: "⭐" },
  { label: "Brain",         value: "🧠" },
  { label: "Books",         value: "📚" },
  { label: "Graduation",    value: "🎓" },
  { label: "Stethoscope",   value: "🩺" },
  { label: "Handshake",     value: "🤝" },
  { label: "Heart",         value: "❤️" },
  { label: "Globe",         value: "🌐" },
  { label: "Certificate",   value: "📜" },
  { label: "Clipboard",     value: "📋" },
  { label: "Hospital",      value: "🏥" },
  { label: "Seedling",      value: "🌱" },
  { label: "Trophy",        value: "🏆" },
  { label: "Lightbulb",     value: "💡" },
  { label: "Rocket",        value: "🚀" },
];

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CourseValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      icon: "",
      image_url: "",
      duration: "",
      schedule: "",
      fees: "",
      badge: "",
      is_published: true,
      order_index: 0,
    },
  });

  const jaForm = useForm<{
    title: string;
    description: string;
    duration: string;
    schedule: string;
    fees: string;
    badge: string;
  }>({
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      schedule: "",
      fees: "",
      badge: "",
    },
  });

  useEffect(() => {
    if (initialData?.translations) {
      const ja = initialData.translations.find((t) => t.locale === "ja");
      if (ja) {
        jaForm.reset({
          title: ja.title || "",
          description: ja.description || "",
          duration: ja.duration || "",
          schedule: ja.schedule || "",
          fees: ja.fees || "",
          badge: ja.badge || "",
        });
      }
    }
  }, [initialData, jaForm]);

  async function onSubmit(values: CourseValues) {
    setLoading(true);
    try {
      const jaValues = jaForm.getValues();
      if (initialData?.id) {
        await updateCourse(initialData.id, values, jaValues);
      } else {
        await addCourse(values, jaValues);
        jaForm.reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const iconValue = form.watch("icon");
  const imageUrl = form.watch("image_url");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be 5 MB or smaller."); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "courses");
      const publicUrl = await uploadImage(formData);
      form.setValue("image_url", publicUrl, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">

        {/* Required fields */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Basic Caregiver" {...field} />
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
                <Textarea placeholder="Describe the course..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Icon field */}
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon (emoji)</FormLabel>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                  {iconValue || "?"}
                </div>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EMOJI_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{opt.value}</span>
                          <span>{opt.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image upload */}
        <div className="space-y-2">
          <p className="text-sm font-medium leading-none">
            Course Image <span className="text-muted-foreground font-normal">(optional — overrides icon on website)</span>
          </p>
          {imageUrl ? (
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
              <Image src={imageUrl} alt="Course image" fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => form.setValue("image_url", "", { shouldDirty: true, shouldValidate: true })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload (max 5 MB)</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          )}
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

        {/* Optional fields */}
        <div className="rounded-lg border p-4 space-y-4">
          <div className="text-sm font-semibold text-muted-foreground">Optional Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
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
                  <FormLabel>Schedule <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Morning: 7:00 AM – 9:00 AM" {...field} />
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
                  <FormLabel>Fees <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
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
                  <FormLabel>Badge <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Most Popular" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="order_index"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={Number.isNaN(field.value) ? "" : field.value}
                      onChange={(e) => {
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-2">
                  <FormLabel>Published</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Japanese Translation */}
        <Form {...jaForm}>
          <div className="rounded-lg border p-4 space-y-4">
            <div className="text-sm font-semibold">Japanese Translation (JA)</div>
            <FormField
              control={jaForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (JA)</FormLabel>
                  <FormControl><Input placeholder="例: 基本介護コース" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={jaForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (JA)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="コース内容..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={jaForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (JA)</FormLabel>
                    <FormControl><Input placeholder="例: 6か月" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={jaForm.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule (JA)</FormLabel>
                    <FormControl><Input placeholder="例: 朝 7:00 – 9:00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={jaForm.control}
                name="fees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fees (JA)</FormLabel>
                    <FormControl><Input placeholder="例: NPR 20,000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={jaForm.control}
                name="badge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge (JA)</FormLabel>
                    <FormControl><Input placeholder="例: 人気" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Course" : "Add Course"}
        </Button>
      </form>
    </Form>
  );
}
