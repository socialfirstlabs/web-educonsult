"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Briefcase,
  Globe,
  GraduationCap,
  FileText,
  Users,
  BookOpen,
  ShieldCheck,
  LucideIcon
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useState } from "react";
import { ServiceForm } from "./ServiceForm";
import { deleteService } from "@/lib/actions/service.action";
import { type ServiceValues } from "@/lib/validations/service.schema";

interface Service extends Omit<ServiceValues, 'is_active' | 'features' | 'tags' | 'image_url'> {
  id: string;
  is_active: boolean | null;
  features?: string | null;
  tags?: string | null;
  image_url?: string | null;
  translations?: { locale: string; title: string; description: string; features?: string | null; tags?: string | null }[];
}

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Globe,
  GraduationCap,
  FileText,
  Users,
  BookOpen,
  ShieldCheck,
};

export function ServiceList({ services }: { services: Service[] }) {
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Order</TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => {
              const tags = service.tags ? service.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
              const features = service.features ? service.features.split(",").map((f) => f.trim()).filter(Boolean) : [];
              return (
                <TableRow key={service.id}>
                  <TableCell>{service.order_index}</TableCell>
                  <TableCell>
                    {service.image_url ? (
                      <div className="relative w-12 h-12 rounded overflow-hidden border border-border">
                        <Image src={service.image_url} alt={service.title} fill sizes="80px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        {(() => { const Icon = iconMap[service.icon_name] || Briefcase; return <Icon size={18} className="text-muted-foreground" />; })()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell className="max-w-[180px]">
                    <span className="text-sm text-muted-foreground line-clamp-2">{service.description}</span>
                  </TableCell>
                  <TableCell className="max-w-[160px]">
                    <div className="flex flex-wrap gap-1">
                      {features.slice(0, 3).map((f) => (
                        <span key={f} className="text-xs bg-muted px-1.5 py-0.5 rounded">{f}</span>
                      ))}
                      {features.length > 3 && <span className="text-xs text-muted-foreground">+{features.length - 3}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.is_active ? "default" : "secondary"}>
                      {service.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingService(service)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog 
        open={!!editingService} 
        onOpenChange={(open) => !open && setEditingService(null)}
      >
      <DialogContent className="w-full max-h-[85vh] overflow-y-auto sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        {editingService && (
          <ServiceForm
            initialData={{
              ...editingService,
              is_active: editingService.is_active ?? false,
              features: editingService.features ?? undefined,
              tags: editingService.tags ?? undefined,
              image_url: editingService.image_url ?? undefined,
            }}
            onSuccess={() => setEditingService(null)}
          />
        )}
      </DialogContent>
      </Dialog>
    </>
  );
}
