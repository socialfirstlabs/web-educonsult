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
import { BlogForm } from "./BlogForm";
import { BlogList } from "./BlogList";
import { BlogValues } from "@/lib/validations/blog.schema";
import { User } from "@supabase/supabase-js";

interface BlogPost extends BlogValues {
  id: string;
  created_at: string;
}

export function BlogClient({ 
  posts,
  currentUser 
}: { 
  posts: BlogPost[];
  currentUser?: User | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">
            Create and manage your educational articles and news.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Post
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogForm 
              onSuccess={() => setOpen(false)} 
              currentUser={currentUser}
            />
          </DialogContent>
        </Dialog>
      </div>

      <BlogList posts={posts} />
    </div>
  );
}
