import { getServicesForDashboard } from "@/lib/actions/service.action";
import { ServiceClient } from "@/components/dashboard/ServiceClient";

export default async function DashboardServicesPage() {
  const services = await getServicesForDashboard();

  return <ServiceClient services={services} />;
}
