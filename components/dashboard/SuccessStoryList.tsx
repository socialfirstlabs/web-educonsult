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
  User,
  MapPin,
  GraduationCap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { SuccessStoryForm } from "./SuccessStoryForm";
import { deleteSuccessStory } from "@/lib/actions/success-story.action";
import { SuccessStoryValues } from "@/lib/validations/success-story.schema";

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

export function SuccessStoryList({ stories }: { stories: SuccessStory[] }) {
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this success story?")) {
      try {
        await deleteSuccessStory(id);
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
              <TableHead>Student</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No success stories found. Add your first story to get started.
                </TableCell>
              </TableRow>
            ) : (
              stories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {story.image_url ? (
                          <Image 
                            src={story.image_url} 
                            alt={story.student_name} 
                            width={32} 
                            height={32} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      {story.student_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <MapPin size={12} className="text-muted-foreground" />
                      {story.destination_country}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <GraduationCap size={12} className="text-muted-foreground" />
                      {story.university_name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={story.is_published ? "default" : "secondary"}>
                      {story.is_published ? "Published" : "Draft"}
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
                        <DropdownMenuItem onClick={() => setEditingStory(story)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(story.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog 
        open={!!editingStory} 
        onOpenChange={(open) => !open && setEditingStory(null)}
      >
      <DialogContent className="w-full max-h-[85vh] overflow-y-auto sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Edit Success Story</DialogTitle>
        </DialogHeader>
        {editingStory && (
          <SuccessStoryForm 
            initialData={editingStory} 
            onSuccess={() => setEditingStory(null)} 
          />
        )}
      </DialogContent>
      </Dialog>
    </>
  );
}
