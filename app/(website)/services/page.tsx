import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Globe, FileText, Users, GraduationCap } from "lucide-react";

export const metadata = {
  title: "Our Services | EduNepal Consultancy",
  description: "Comprehensive study abroad counseling, visa processing, and documentation support.",
};

const services = [
  {
    title: "Study Abroad Counseling",
    description: "Personalized guidance to help you choose the right country, university, and course based on your career goals and budget.",
    icon: Users,
  },
  {
    title: "University Applications",
    description: "Step-by-step assistance with the application process, including SOP writing and document preparation.",
    icon: GraduationCap,
  },
  {
    title: "Visa Processing",
    description: "Expert guidance through the complex visa application process to maximize your chances of success.",
    icon: Globe,
  },
  {
    title: "Documentation Support",
    description: "Professional translation and certification services for all your academic and financial documents.",
    icon: FileText,
  },
];

export default function ServicesPage() {
  return (
    <div className="container py-20 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-muted-foreground">
          We provide end-to-end support for students aspiring to gain international education and global exposure.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="flex flex-col h-full">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <service.icon size={24} />
              </div>
              <CardTitle className="text-2xl">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="text-green-500" size={16} />
                  <span>Expert Advice</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="text-green-500" size={16} />
                  <span>Transparent Process</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
