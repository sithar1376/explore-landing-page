import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://explore.smilewithsithar.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Connect With Purpose | SmileWithSithar",
  description:
    "Explore dental and community health outreach with Sithar Chozom Lama. Connect, share experiences, and discover meaningful ways to contribute.",
  openGraph: {
    title: "Explore Meaningful Outreach | SmileWithSithar",
    description:
      "Let's connect, share experiences, and explore meaningful possibilities in dental and community health outreach.",
    url: siteUrl,
    siteName: "SmileWithSithar",
    images: [
      {
        url: "/smilewithsithar-logo.webp",
        width: 742,
        height: 336,
        alt: "SmileWithSithar",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Meaningful Outreach | SmileWithSithar",
    description:
      "Connect with Sithar and explore meaningful possibilities in dental and community health outreach.",
    images: ["/smilewithsithar-logo.webp"],
  },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
