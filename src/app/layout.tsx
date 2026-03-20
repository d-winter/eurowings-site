import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PreviewWrapper } from "@/components/PreviewWrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eurowings – Fly Smarter",
  description:
    "Book affordable flights across Europe and beyond with Eurowings. Great fares, great service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-ew-light`}>
        <PreviewWrapper>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </PreviewWrapper>
      </body>
    </html>
  );
}
