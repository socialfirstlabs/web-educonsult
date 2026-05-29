import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "J & N Caregiver Training — Your Gateway to Japan",
  description:
    "Accredited caregiver training for Nepali professionals — language classes, visa support, and guaranteed employer matching in Japan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${roboto.variable} font-[family-name:var(--font-roboto)] bg-white text-jn-text-dark overflow-x-hidden leading-[1.7] antialiased`}>
        {children}
      </body>
    </html>
  );
}
