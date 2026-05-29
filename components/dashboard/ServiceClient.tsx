"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ServiceForm } from "./ServiceForm";
import { ServiceList } from "./ServiceList";
import { type ServiceValues } from "@/lib/validations/service.schema";

interface Service extends Omit<ServiceValues, 'is_active' | 'features' | 'tags' | 'image_url'> {
  id: string;
  is_active: boolean | null;
  features?: string | null;
  tags?: string | null;
  image_url?: string | null;
  translations?: { locale: string; title: string; description: string; features?: string | null; tags?: string | null }[];
}

export function ServiceClient({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            }
          />
          <DialogContent className="w-full max-h-[85vh] overflow-y-auto sm:max-w-[720px]">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <ServiceForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <div className="p-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
          <p className="text-lg font-medium">No services found.</p>
          <p className="text-sm">Add your first service to get started.</p>
        </div>
      ) : (
        <ServiceList services={services} />
      )}
    </div>
  );
}
