/**
 * Project-wide constants
 */

export const SITE_CONFIG = {
  name: "J & N Caregiver Training",
  description: "Your path to global education",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    facebook: "https://facebook.com/edunepal",
    instagram: "https://instagram.com/edunepal",
  },
  contact: {
    email: "info@edunepal.com",
    phone: "+977 1 4XXXXXX",
    address: "Kathmandu, Nepal",
  },
};

export const NAV_LINKS = {
  website: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Study in Japan", href: "/study-in-japan" },
    { label: "Language Classes", href: "/language-classes" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  dashboard: [
    { label: "Overview", href: "/dashboard" },
    { label: "Contacts", href: "/dashboard/leads" },
    { label: "Courses", href: "/dashboard/courses" },
    { label: "Blog Posts", href: "/dashboard/blog" },
    { label: "Success Stories", href: "/dashboard/success-stories" },
  ],
};

const isEnabled = (value: string | undefined) =>
  ["true", "1", "yes", "on"].includes((value ?? "").trim().toLowerCase());

export const FEATURE_FLAGS = {
  ENABLE_BLOG: isEnabled(process.env.NEXT_PUBLIC_ENABLE_BLOG),
};
