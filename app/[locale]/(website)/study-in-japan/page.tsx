import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Study in Japan | EduNepal Consultancy",
  description: "Learn about the advantages of studying in Japan, visa process, costs, and work opportunities for Nepalese students.",
};

export default function StudyInJapanPage() {
  return (
    <div className="container py-20 px-4 space-y-20">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Unlock Your Future in <br /><span className="text-primary">Japan</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Japan offers a unique blend of world-class education, high-tech innovation, and traditional culture. It is one of the most preferred destinations for Nepalese students.
          </p>
          <div className="flex gap-4">
            <Link href="/contact">
               <Button size="lg" className="px-8">Get Free Counseling</Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 aspect-video bg-muted rounded-3xl flex items-center justify-center border-4 border-white shadow-xl">
             <span className="text-muted-foreground italic">Japan University Campus Placeholder</span>
        </div>
      </div>

      {/* Advantages */}
      <section className="bg-muted/50 -mx-4 px-4 py-20 rounded-3xl">
        <div className="max-w-4xl mx-auto text-center mb-12">
           <h2 className="text-3xl font-bold mb-4">Advantages of Studying in Japan</h2>
           <p className="text-muted-foreground">Discover why thousands of international students choose Japan every year.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { title: "High Academic Standards", desc: "Japanese universities are consistently ranked among the top in Asia and the world." },
             { title: "Safe & Welcoming", desc: "Japan is one of the safest countries in the world with a very low crime rate." },
             { title: "Affordable Education", desc: "Lower tuition fees compared to the US or UK, with many scholarship opportunities." },
             { title: "Part-time Work", desc: "Students are legally allowed to work up to 28 hours per week during school terms." },
             { title: "Post-Study Careers", desc: "Increasing demand for skilled international graduates in various Japanese industries." },
             { title: "Rich Culture", desc: "Experience a unique blend of ancient traditions and cutting-edge technology." }
           ].map((item, i) => (
             <Card key={i} className="border-none shadow-sm">
                <CardHeader>
                   <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="text-primary" size={20} /> {item.title}
                   </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.desc}</CardContent>
             </Card>
           ))}
        </div>
      </section>

      {/* Process */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">The Application Process</h2>
          <p className="text-muted-foreground">We help you through every single step of your journey to Japan.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Counseling", desc: "Identify your goals and choose the right institution." },
            { step: "02", title: "Language Training", desc: "Complete required Japanese language hours (N5/N4)." },
            { step: "03", title: "COE Application", desc: "Submission of documents to Japanese immigration for COE." },
            { step: "04", title: "Visa Interview", desc: "Final visa application at the Japanese Embassy in Nepal." }
          ].map((item, i) => (
            <div key={i} className="relative p-6 border rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow">
               <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">{item.step}</div>
               <h3 className="text-xl font-bold mt-4 mb-2">{item.title}</h3>
               <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cost & Work */}
      <div className="grid md:grid-cols-2 gap-12 items-center border rounded-3xl p-8 md:p-12 bg-primary text-primary-foreground">
        <div>
           <h2 className="text-3xl font-bold mb-6">Study Costs & Work Opportunities</h2>
           <div className="space-y-6">
              <p className="text-primary-foreground/90">
                Tuition fees vary depending on whether you are studying at a language school, vocational college, or university. On average, expect to pay between ¥600,000 to ¥1,000,000 per year.
              </p>
              <ul className="space-y-3">
                 <li className="flex gap-2"><strong>Work Limit:</strong> 28 hours per week (Full-time during holidays)</li>
                 <li className="flex gap-2"><strong>Avg. Hourly Wage:</strong> ¥950 - ¥1,200 per hour</li>
                 <li className="flex gap-2"><strong>Expenses:</strong> Monthly living costs approx ¥80,000 - ¥120,000</li>
              </ul>
           </div>
        </div>
        <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
           <h3 className="text-xl font-bold mb-4">Ready for Japan?</h3>
           <p className="mb-8 opacity-90">Start your Japanese language classes today to meet the intake requirements.</p>
           <Link href="/contact">
              <Button variant="secondary" size="lg" className="w-full">Book Free Counseling</Button>
           </Link>
        </div>
      </div>
    </div>
  );
}
