# lib/services

> **Status: Reserved for service-layer abstraction.**

This directory is reserved for business-logic service modules that wrap Supabase queries and can be reused across multiple Server Actions.

**When to use this:**
- When the same data-fetching logic is duplicated across two or more Server Actions or Server Components.
- When query logic becomes too complex for a single action file.

**Example service file:** `lib/services/blog.service.ts`
```ts
import { createServerClient } from "@/lib/supabase/server";

export async function getPublishedPosts() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
}
```
