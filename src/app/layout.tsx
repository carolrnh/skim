import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "../lib/site";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  pageMetadata,
  siteGraphJsonLd,
} from "../lib/seo";
import JsonLd from "./JsonLd";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    path: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={siteGraphJsonLd()} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
