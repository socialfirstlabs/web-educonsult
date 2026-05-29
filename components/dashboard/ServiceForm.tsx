"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceValues } from "@/lib/validations/service.schema";
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
import { TagInput } from "@/components/ui/tag-input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { addService, updateService } from "@/lib/actions/service.action";
import { uploadImage } from "@/lib/actions/storage.action";
import { useState, useEffect } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface ServiceFormProps {
  initialData?: ServiceValues & {
    id: string;
    translations?: { locale: string; title: string; description: string; features?: string | null; tags?: string | null }[];
  };
  onSuccess?: () => void;
}

const icons = [
  { label: "Briefcase", value: "Briefcase" },
  { label: "Globe", value: "Globe" },
  { label: "Graduation Cap", value: "GraduationCap" },
  { label: "File Text", value: "FileText" },
  { label: "Users", value: "Users" },
  { label: "Book Open", value: "BookOpen" },
  { label: "Shield Check", value: "ShieldCheck" },
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function ServiceForm({ initialData, onSuccess }: ServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      features: "",
      tags: "",
      image_url: "",
      icon_name: "Briefcase",
      is_active: true,
      order_index: 0,
    },
  });

  const jaForm = useForm<{ title: string; description: string; features: string; tags: string }>(
    {
      defaultValues: {
        title: "",
        description: "",
        features: "",
        tags: "",
      },
    }
  );

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description,
        features: initialData.features || "",
        tags: initialData.tags || "",
        image_url: initialData.image_url || "",
        icon_name: initialData.icon_name,
        is_active: initialData.is_active,
        order_index: initialData.order_index,
      });

      const ja = initialData.translations?.find((t) => t.locale === "ja");
      if (ja) {
        jaForm.reset({
          title: ja.title || "",
          description: ja.description || "",
          features: ja.features || "",
          tags: ja.tags || "",
        });
      }
    }
  }, [initialData, form, jaForm]);

  const imageUrl = form.watch("image_url");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "services");

      const publicUrl = await uploadImage(formData);
      form.setValue("image_url", publicUrl, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSubmit(values: ServiceValues) {
    setLoading(true);
    try {
      const jaValues = jaForm.getValues();
      if (initialData?.id) {
        await updateService(initialData.id, values, jaValues);
      } else {
        await addService(values, jaValues);
        form.reset();
        jaForm.reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {/* Image Upload */}
        <div className="space-y-2">
          <p className="text-sm font-medium leading-none">Service Image</p>
          {imageUrl ? (
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
              <Image src={imageUrl} alt="Service image" fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Visa Processing" {...field} />
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
                  placeholder="Describe your service..."
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
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Features</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Type a feature and press Enter or comma…"
                />
              </FormControl>
              <FormDescription>
                Each feature appears as a bullet point on the service card.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Type a tag and press Enter or comma…"
                />
              </FormControl>
              <FormDescription>
                Short labels shown as badge chips at the bottom of the card.
              </FormDescription>
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
                  <FormLabel>Service Title (JA)</FormLabel>
                  <FormControl>
                    <Input placeholder="例: ビザ手続き" {...field} />
                  </FormControl>
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
                    <Textarea
                      placeholder="サービス内容を日本語で入力..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={jaForm.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Features (JA)</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="例: 専門相談 と入力してEnterキー…"
                    />
                  </FormControl>
                  <FormDescription>
                    Each feature appears as a bullet point on the service card.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={jaForm.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (JA)</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="例: ビザ と入力してEnterキー…"
                    />
                  </FormControl>
                  <FormDescription>
                    Short labels shown as badge chips at the bottom of the card.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icon_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {icons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order_index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
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
        </div>
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <div className="text-[0.8rem] text-muted-foreground">
                  Control if this service is visible on the website.
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
          {initialData ? "Update Service" : "Add Service"}
        </Button>
      </form>
    </Form>
  );
}
