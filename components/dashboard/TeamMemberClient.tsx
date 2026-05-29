"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { TeamMemberValues } from "@/lib/validations/team-member.schema";
import { TeamMemberForm } from "./TeamMemberForm";
import { TeamMemberList } from "./TeamMemberList";

interface TeamMember extends Omit<TeamMemberValues, "image_url" | "is_active"> {
  id: string;
  created_at: string | null;
  image_url: string | null;
  is_active: boolean | null;
  translations?: { locale: string; name: string; position: string }[];
}

export function TeamMemberClient({ members }: { members: TeamMember[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage the team shown on the About page.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
          } />
          <DialogContent className="w-full max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <TeamMemberForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <TeamMemberList members={members} />
    </div>
  );
}
