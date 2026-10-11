import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThankYouContent } from "@/components/ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You | SmileWithSithar",
  description: "Thank you for requesting a Meaningful Outreach Discovery Session with Sithar.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <ThankYouContent />
      <Footer />
    </>
  );
}
