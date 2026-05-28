import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Globe, 
  FileText, 
  Users, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  ShieldCheck,
  LucideIcon
} from "lucide-react";
import { getServices } from "@/lib/actions/service.action";
import { getT, type Locale } from "@/lib/i18n";

export const metadata = {
  title: "Our Services | J&N Caregiver Training",
  description: "Comprehensive study abroad counseling, visa processing, and documentation support.",
};

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Globe,
  GraduationCap,
  FileText,
  Users,
  BookOpen,
  ShieldCheck,
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale as Locale;
  const t = getT(safeLocale);
  const services = await getServices(safeLocale);
  const activeServices = services.filter(s => s.is_active);

  return (
    <div className="container py-20 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">{t("nav.services")}</h1>
        <p className="text-xl text-muted-foreground">
          {t("home.heroSubtitle")}
        </p>
      </div>

      {activeServices.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">{t("services.empty")}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {activeServices.map((service) => {
            const Icon = iconMap[service.icon_name] || Briefcase;
            return (
              <Card key={service.id} id={service.id} className="flex flex-col h-full scroll-mt-20">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  {service.features && (
                    <ul className="space-y-2">
                      {service.features.split(",").map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="text-green-500" size={16} />
                          <span>{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
