import { getServices } from "@/lib/actions/service.action";
import { ServiceClient } from "@/components/dashboard/ServiceClient";

export default async function DashboardServicesPage() {
  const services = await getServices();

  return <ServiceClient services={services} />;
}
