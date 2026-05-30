import "../style/main.css";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Navbar } from "@/ui/components/custom/Navbar";
import { Footer } from "@/ui/components/custom/Footer";

const font = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.STRUCTURE_NAME,
  description: "Famiglia, natura e ospitalità. Il tuo B&B immerso nel verde.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font.variable} antialiased`}>
      <body className="m-0 p-0">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
