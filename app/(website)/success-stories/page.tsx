import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, MapPin, Quote } from "lucide-react";

export const metadata = {
  title: "Success Stories | EduNepal Consultancy",
  description: "Check out our students' success stories and visa results for studying in Japan and other countries.",
};

export default async function SuccessStoriesPage() {
  const supabase = await createClient();
  
  const { data: stories } = await supabase
    .from('success_stories')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="container py-20 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Student Success Stories</h1>
        <p className="text-xl text-muted-foreground">Real stories from our students who achieved their dreams of studying abroad.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories?.map((story) => (
          <Card key={story.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow flex flex-col">
            <div className="aspect-square bg-muted relative">
              {story.image_url ? (
                <img src={story.image_url} alt={story.student_name} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                   <GraduationCap size={48} className="opacity-20" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur rounded-lg flex items-center justify-between shadow-sm">
                 <div className="font-bold text-sm truncate">{story.student_name}</div>
                 <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                    <MapPin size={12} /> {story.destination_country}
                 </div>
              </div>
            </div>
            <CardContent className="flex-1 p-6 space-y-4">
              <Quote className="text-primary/20" size={32} />
              <p className="italic text-muted-foreground leading-relaxed">
                &quot;{story.testimonial}&quot;
              </p>
              <div className="pt-4 border-t text-xs text-muted-foreground">
                <p><strong>University:</strong> {story.university_name || 'Japanese Language School'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!stories || stories.length === 0) && (
           <div className="col-span-full py-20 text-center bg-muted/30 rounded-2xl flex flex-col items-center">
              <GraduationCap size={64} className="text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Your story could be next! Start your journey with us.</p>
           </div>
        )}
      </div>
    </div>
  );
}
