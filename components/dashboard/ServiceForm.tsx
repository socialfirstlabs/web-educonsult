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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { addService, updateService } from "@/lib/actions/service.action";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceFormProps {
  initialData?: ServiceValues & { id: string };
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

export function ServiceForm({ initialData, onSuccess }: ServiceFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      features: "",
      icon_name: "Briefcase",
      is_active: true,
      order_index: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description,
        features: initialData.features || "",
        icon_name: initialData.icon_name,
        is_active: initialData.is_active,
        order_index: initialData.order_index,
      });
    }
  }, [initialData, form]);

  async function onSubmit(values: ServiceValues) {
    setLoading(true);
    try {
      if (initialData?.id) {
        await updateService(initialData.id, values);
      } else {
        await addService(values);
        form.reset();
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
              <FormLabel>Key Features (Comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Expert Advice, Transparent Process, Quick Results" {...field} />
              </FormControl>
              <FormDescription>
                Enter features separated by commas. These will be displayed as a list on the website.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
