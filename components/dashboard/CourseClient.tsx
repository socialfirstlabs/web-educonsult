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
import { CourseForm } from "./CourseForm";
import { CourseList } from "./CourseList";
import { type CourseValues } from "@/lib/validations/course.schema";

interface Course extends CourseValues {
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
}

export function CourseClient({ courses }: { courses: Course[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
          <p className="text-muted-foreground">
            Create and manage language courses displayed on your website.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button id="add-course-button">
                <Plus className="mr-2 h-4 w-4" /> Add Course
              </Button>
            }
          />
          <DialogContent className="w-full max-h-[85vh] overflow-y-auto sm:max-w-[720px]">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <CourseForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <CourseList courses={courses} />
    </div>
  );
}
