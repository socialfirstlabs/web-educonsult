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
  Calendar,
  ExternalLink
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
import { format } from "date-fns";
import { BlogForm } from "./BlogForm";
import { deleteBlogPost } from "@/lib/actions/blog.action";
import { BlogValues } from "@/lib/validations/blog.schema";
import { defaultLocale } from "@/lib/i18n/config";

interface BlogPost extends BlogValues {
  id: string;
  created_at: string;
  translations?: {
    locale: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
  }[];
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogPost(id);
      } catch (error) {
        console.error(error);
        alert("Failed to delete post.");
      }
    }
  };

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No blog posts found. Create your first post to get started.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 relative rounded bg-muted overflow-hidden flex-shrink-0">
                        {post.image_url ? (
                          <Image 
                            src={post.image_url} 
                            alt={post.title} 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[10px] text-muted-foreground">No Image</div>
                        )}
                      </div>
                      <span className="line-clamp-1 max-w-[200px]">{post.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    /{post.slug}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-muted-foreground" />
                      {format(new Date(post.published_at || post.created_at), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.is_published ? "default" : "secondary"}>
                      {post.is_published ? "Published" : "Draft"}
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
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(`/${defaultLocale}/blog/${post.slug}`, "_blank")
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" /> View Live
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingPost(post)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(post.id)}
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
        open={!!editingPost} 
        onOpenChange={(open) => !open && setEditingPost(null)}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <BlogForm 
              initialData={editingPost} 
              onSuccess={() => setEditingPost(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
