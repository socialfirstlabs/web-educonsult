export default function DashboardBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">New Post</button>
      </div>
      <div className="p-20 border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground">
         <p>Blog CMS functionality coming soon.</p>
      </div>
    </div>
  );
}
