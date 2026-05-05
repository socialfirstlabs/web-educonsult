import { getPublishedSuccessStories } from "@/lib/actions/success-story.action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Quote, GraduationCap, MapPin } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getT, type Locale } from "@/lib/i18n";

export const metadata = {
  title: "Success Stories | EduNepal Consultancy",
  description: "Read about our students who have successfully achieved their dreams of studying abroad.",
};

export default async function SuccessStoriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const stories = await getPublishedSuccessStories(locale);

  return (
    <div className="container py-20 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">{t("successStories.title")}</h1>
        <p className="text-xl text-muted-foreground">
          {t("successStories.subtitle")}
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground italic text-lg">
            {t("successStories.empty")}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card key={story.id} className="h-full flex flex-col border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={story.image_url} alt={story.student_name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {story.student_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-xl">{story.student_name}</h3>
                    <div className="flex items-center gap-1 text-sm text-primary font-medium">
                      <MapPin size={14} />
                      {story.destination_country}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {story.university_name && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <GraduationCap size={16} className="text-primary" />
                    <span className="italic">{story.university_name}</span>
                  </div>
                )}
                <div className="relative pt-6">
                  <Quote className="absolute top-0 left-0 text-primary/10 h-10 w-10 -z-10" />
                  <p className="text-muted-foreground line-clamp-6 leading-relaxed">
                    {story.testimonial}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-20 p-10 rounded-2xl bg-primary text-primary-foreground text-center">
        <h2 className="text-3xl font-bold mb-4">{t("cta.readyToWriteStory")}</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          {t("cta.contactForCounseling")}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-primary hover:bg-background/90 h-11 px-8"
        >
          {t("cta.bookFreeCounseling")}
        </Link>
      </div>
    </div>
  );
}
