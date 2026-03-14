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

export function CourseClient({ courses }: { courses: any[] }) {
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
          <DialogContent className="sm:max-w-[600px]">
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
