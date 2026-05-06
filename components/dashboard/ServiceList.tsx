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

interface Service extends ServiceValues {
  id: string;
  translations?: { locale: string; title: string; description: string; features?: string | null }[];
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
              <TableHead className="w-[80px]">Order</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => {
              const Icon = iconMap[service.icon_name] || Briefcase;
              return (
                <TableRow key={service.id}>
                  <TableCell>{service.order_index}</TableCell>
                  <TableCell>
                    <Icon size={18} />
                  </TableCell>
                  <TableCell className="font-medium">{service.title}</TableCell>
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
            initialData={editingService} 
            onSuccess={() => setEditingService(null)} 
          />
        )}
      </DialogContent>
      </Dialog>
    </>
  );
}
