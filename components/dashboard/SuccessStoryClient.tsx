"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { SuccessStoryValues } from "@/lib/validations/success-story.schema";
import { SuccessStoryForm } from "./SuccessStoryForm";
import { SuccessStoryList } from "./SuccessStoryList";

interface SuccessStory extends SuccessStoryValues {
  id: string;
  created_at: string;
  translations?: {
    locale: string;
    student_name: string;
    destination_country: string;
    university_name?: string | null;
    testimonial?: string | null;
  }[];
}

export function SuccessStoryClient({ stories }: { stories: SuccessStory[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Success Stories</h1>
          <p className="text-muted-foreground">
            Manage student success stories and testimonials.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Story
              </Button>
            }
          />
          <DialogContent className="w-full max-h-[85vh] overflow-y-auto sm:max-w-[720px]">
            <DialogHeader>
              <DialogTitle>Add Success Story</DialogTitle>
            </DialogHeader>
            <SuccessStoryForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <SuccessStoryList stories={stories} />
    </div>
  );
}
