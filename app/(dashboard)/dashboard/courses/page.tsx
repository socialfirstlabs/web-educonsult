import { getCoursesForDashboard } from "@/lib/actions/course.action";
import { CourseClient } from "@/components/dashboard/CourseClient";

export const dynamic = "force-dynamic";

export default async function DashboardCoursesPage() {
  const courses = await getCoursesForDashboard();

  return <CourseClient courses={courses} />;
}
