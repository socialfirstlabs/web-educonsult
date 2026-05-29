"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal, Pencil, Trash, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { TeamMemberForm } from "./TeamMemberForm";
import { deleteTeamMember } from "@/lib/actions/team-member.action";
import type { TeamMemberValues } from "@/lib/validations/team-member.schema";

interface TeamMember extends Omit<TeamMemberValues, "image_url" | "is_active"> {
  id: string;
  created_at: string | null;
  image_url: string | null;
  is_active: boolean | null;
  translations?: { locale: string; name: string; position: string }[];
}

export function TeamMemberList({ members }: { members: TeamMember[] }) {
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        await deleteTeamMember(id);
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
              <TableHead>Photo</TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Position (EN)</TableHead>
              <TableHead>Name (JA)</TableHead>
              <TableHead>Position (JA)</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No team members found. Add your first member.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => {
                const ja = member.translations?.find((t) => t.locale === "ja");
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {member.image_url ? (
                          <Image src={member.image_url} alt={member.name} width={40} height={40} className="h-full w-full object-cover" />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{member.position}</TableCell>
                    <TableCell className="text-sm">{ja?.name || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{ja?.position || "—"}</TableCell>
                    <TableCell className="text-sm">{member.order_index}</TableCell>
                    <TableCell>
                      <Badge variant={member.is_active ? "default" : "secondary"}>
                        {member.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingMember(member)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(member.id)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="w-full max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <TeamMemberForm
              initialData={{
                ...editingMember,
                image_url: editingMember.image_url ?? "",
                is_active: editingMember.is_active ?? true,
              }}
              onSuccess={() => setEditingMember(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
