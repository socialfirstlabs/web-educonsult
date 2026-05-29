import { getTeamMembersForDashboard } from "@/lib/actions/team-member.action";
import { TeamMemberClient } from "@/components/dashboard/TeamMemberClient";

export default async function TeamMembersPage() {
  const members = await getTeamMembersForDashboard();
  return <TeamMemberClient members={members} />;
}
