import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns';

export default async function LeadsPage() {
  const supabase = await createClient();
  
  if (!supabase) return <div className="p-4 border border-destructive text-destructive rounded-md bg-destructive/10">Supabase environment variables are missing.</div>;

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return <div className="p-4 border border-destructive text-destructive rounded-md bg-destructive/10">Error loading leads: {error.message}</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'counseling': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'converted': return 'bg-green-100 text-green-800 hover:bg-green-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Leads</h1>
        <Badge variant="outline">{leads?.length || 0} Total Leads</Badge>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Interested In</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="max-w-[200px]">Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads?.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {format(new Date(lead.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="font-semibold">{lead.name}</TableCell>
                <TableCell>
                  <div className="text-sm">{lead.email}</div>
                  <div className="text-sm text-muted-foreground">{lead.phone}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{lead.interested_country}</div>
                  <div className="text-xs text-muted-foreground">{lead.course_interest}</div>
                </TableCell>
                <TableCell>
                  <Badge className={`capitalize border-none ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm truncate max-w-[200px]" title={lead.message}>
                  {lead.message}
                </TableCell>
              </TableRow>
            ))}
            {leads?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
