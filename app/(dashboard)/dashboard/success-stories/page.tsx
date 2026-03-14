import { getSuccessStories } from "@/lib/actions/success-story.action";
import { SuccessStoryClient } from "@/components/dashboard/SuccessStoryClient";

export const metadata = {
  title: "Success Stories Management | Dashboard",
};

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <SuccessStoryClient stories={stories} />
    </div>
  );
}
