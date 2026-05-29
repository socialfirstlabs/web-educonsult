import { getEnrollments } from "@/lib/actions/enrollment.action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  EnrollmentStatusSelect,
  EnrollmentDeleteButton,
} from "@/components/dashboard/EnrollmentStatusSelect";

export default async function EnrollmentsPage() {
  const enrollments = await getEnrollments();

  const pending   = enrollments.filter((e) => e.status === "pending").length;
  const enrolled  = enrollments.filter((e) => e.status === "enrolled").length;
  const reviewing = enrollments.filter((e) => e.status === "reviewing").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">Enrollments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Applications submitted via the Apply / Enroll Now form
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {enrollments.length} Total
        </Badge>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800">
          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
          {pending} Pending
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-800">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          {reviewing} Reviewing
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-800">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          {enrolled} Enrolled
        </span>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">Date</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Japanese Level</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground italic"
                >
                  No applications yet. They will appear here once users submit
                  the Apply form on the website.
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((e) => (
                <TableRow key={e.id}>
                  {/* Date */}
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {format(
                      new Date(e.created_at ?? new Date()),
                      "MMM d, yyyy",
                    )}
                  </TableCell>

                  {/* Name */}
                  <TableCell className="font-semibold whitespace-nowrap">
                    {e.first_name} {e.last_name}
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="text-sm">{e.email}</div>
                    <div className="text-xs text-muted-foreground">{e.phone}</div>
                  </TableCell>

                  {/* Japanese level */}
                  <TableCell className="text-sm">{e.japanese_level}</TableCell>

                  {/* Program */}
                  <TableCell className="text-sm max-w-[180px] truncate" title={e.program_interest}>
                    {e.program_interest}
                  </TableCell>

                  {/* Status — inline editable */}
                  <TableCell>
                    <EnrollmentStatusSelect id={e.id} current={e.status} />
                  </TableCell>

                  {/* Delete */}
                  <TableCell>
                    <EnrollmentDeleteButton id={e.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
