import { LeadForm } from "@/components/website/LeadForm";
import { getPublishedCourses } from "@/lib/actions/course.action";

export const metadata = {
  title: "Contact Us | EduNepal Consultancy",
  description:
    "Get free counseling for your study abroad dreams. Contact us for Japanese language classes and visa processing.",
};

export default async function ContactPage() {
  const courses = await getPublishedCourses();

  return (
    <div className="container py-20 px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Have questions? We&apos;re here to help you navigate your
            educational journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Free Counseling</h2>
            <p className="mb-8 text-muted-foreground">
              Fill out the form below and one of our expert counselors will get
              back to you within 24 hours to discuss your study abroad plans or
              language course interests.
            </p>
            <LeadForm courses={courses} />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Our Office</h3>
              <p className="text-muted-foreground">
                Main Building, Putalisadak
                <br />
                Kathmandu, Nepal
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Phone & Email</h3>
              <p className="text-muted-foreground">
                Tel: +977-1-4XXXXXX
                <br />
                Mobile: +977-98XXXXXXXX
                <br />
                Email: info@edunepal.com
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Business Hours</h3>
              <p className="text-muted-foreground">
                Sunday - Friday: 9:00 AM - 5:00 PM
                <br />
                Saturday: Closed
              </p>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56502.18050881408!2d85.3144914!3d27.7362292!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x666f85d4555c2d43%3A0xe068e8cb2a545cc3!2sJLCC%2C%20Kathmandu%20(Japanese%20Language%20%26%20Culture%20Centre%2C%20Kathmandu)!5e0!3m2!1sen!2snp!4v1773389899650!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
