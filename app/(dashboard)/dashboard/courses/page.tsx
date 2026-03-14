import { getCourses } from "@/lib/actions/course.action";
import { CourseClient } from "@/components/dashboard/CourseClient";

export const dynamic = "force-dynamic";

export default async function DashboardCoursesPage() {
  const courses = await getCourses();

  return <CourseClient courses={courses} />;
}
