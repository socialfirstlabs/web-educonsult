import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, Calendar, Wallet } from "lucide-react";
import { getPublishedCourses } from "@/lib/actions/course.action";

export const metadata = {
  title: "Japanese Language Classes | EduNepal Consultancy",
  description: "Join our expert-led Japanese language courses (N5, N4, N3) in Kathmandu. Flexible schedules and affordable fees.",
};

export default async function LanguageClassesPage() {
  const courses = await getPublishedCourses();

  return (
    <div className="container py-20 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Japanese Language Classes</h1>
        <p className="text-xl text-muted-foreground">
          Master the Japanese language with our JLPT-certified instructors and interactive learning environment.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/50">
          <p className="text-muted-foreground">No courses are currently available. Please check back later.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
                  {course.badge && <Badge variant="secondary">{course.badge}</Badge>}
                </div>
                <p className="text-muted-foreground">{course.description}</p>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="text-primary" size={18} />
                  <span><strong>Duration:</strong> {course.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="text-primary" size={18} />
                  <span><strong>Schedule:</strong> {course.schedule}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Wallet className="text-primary" size={18} />
                  <span><strong>Fees:</strong> {course.fees}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/contact" className="w-full">
                  <Button className="w-full" size="lg">Enroll Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
