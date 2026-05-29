"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamMemberSchema, type TeamMemberValues } from "@/lib/validations/team-member.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { addTeamMember, updateTeamMember } from "@/lib/actions/team-member.action";
import { uploadImage } from "@/lib/actions/storage.action";
import { useState, useRef, useEffect } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface TeamMemberFormProps {
  initialData?: TeamMemberValues & {
    id: string;
    translations?: { locale: string; name: string; position: string }[];
  };
  onSuccess?: () => void;
}

export function TeamMemberForm({ initialData, onSuccess }: TeamMemberFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TeamMemberValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      position: "",
      image_url: "",
      order_index: 0,
      is_active: true,
    },
  });

  const jaForm = useForm<{ name: string; position: string }>({
    defaultValues: { name: "", position: "" },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        position: initialData.position,
        image_url: initialData.image_url,
        order_index: initialData.order_index,
        is_active: initialData.is_active,
      });
      const ja = initialData.translations?.find((t) => t.locale === "ja");
      if (ja) jaForm.reset({ name: ja.name ?? "", position: ja.position ?? "" });
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
      formData.append("folder", "team");
      const publicUrl = await uploadImage(formData);
      form.setValue("image_url", publicUrl, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: TeamMemberValues) {
    setLoading(true);
    try {
      const jaValues = jaForm.getValues();
      if (initialData?.id) {
        await updateTeamMember(initialData.id, values, jaValues);
      } else {
        await addTeamMember(values, jaValues);
        form.reset();
        jaForm.reset();
      }
      onSuccess?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {/* English fields */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name (EN)</FormLabel>
              <FormControl><Input placeholder="e.g. Asha Koirala" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position (EN)</FormLabel>
              <FormControl><Input placeholder="e.g. Program Director" {...field} /></FormControl>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (JA)</FormLabel>
                  <FormControl><Input placeholder="例: 山田 太郎" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={jaForm.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position (JA)</FormLabel>
                  <FormControl><Input placeholder="例: プログラムディレクター" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>

        {/* Photo upload */}
        <div className="space-y-2">
          <p className="text-sm font-medium leading-none">Photo</p>
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <div className="relative h-24 w-24 rounded-lg overflow-hidden border">
                <Image src={imageUrl} alt="Preview" fill sizes="96px" className="object-cover" />
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="order_index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-2">
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Member" : "Add Member"}
        </Button>
      </form>
    </Form>
  );
}
