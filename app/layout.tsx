import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NavWrapper from "@/components/NavWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Blogs",
//   description: "A Blogging Platform",
//   authors: [{ name: "Bishu Thapa", url: "https://github.com/Bishuthapa" }, {name: "Bishesh Thapa", url: "https://github.com/bishuthapa"}],
//   keywords: ["Blogs", "Blog", "Blogging", "Blogging Platform", "Nextjs", "Bishu blog", "Bishu blogs"],
//   icons: {
//     icon: "/window.svg",
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "/",
//     siteName: "Blogs",
//     title: "Blogs",
//     description: "A Blogging Platform",
//     images: [
//       {
//         url: "/api/og",
//         width: 1200,
//         height: 630,
//         alt: "Blogs",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Blogs",
//     description: "A Blogging Platform",
//     images: ["/api/og"],
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },

// };

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "Blogs",
    template: "%s | Blogs",
  },
  description: "A blogging platform for sharing daily life moments and having fun.",
  authors: [
    { name: "Bishu Thapa", url: "https://github.com/Bishuthapa" },
    { name: "Bishesh Thapa", url: "https://github.com/bishuthapa" },
  ],
  keywords: ["Blogs", "Blog", "Blogging", "Blogging Platform", "Nextjs", "Bishu blog", "Bishu blogs", "Bishesh blog", "Bishesh blogs", "Nepal", "AI blogs"],
  icons: {
    icon: "/window.svg",
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "https://bishesh0.com.np/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Bishu Blogs",
    title: "Blogs",
    description: "A Blogging Platform",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Blogs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs",
    description: "A Blogging Platform",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavWrapper />
        {children}
        <Toaster />
        

      </body>
    </html>
  );
}
