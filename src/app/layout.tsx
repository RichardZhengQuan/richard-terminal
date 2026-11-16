import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./journey.css";

const title = "Richard Q — Product Manager & Projects";
const description = "Richard Q’s bilingual personal page and project portfolio. Explore practical AI tools, agent systems, native apps, and product design work.";
const siteUrl = new URL("https://pmrichq.com");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico?v=lollipop-20261116", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-32x32.png?v=lollipop-20261116", type: "image/png", sizes: "32x32" },
      { url: "/favicon.svg?v=lollipop-20261116", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=lollipop-20261116",
    apple: [{ url: "/apple-touch-icon.png?v=lollipop-20261116", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f7f7f5" }, { media: "(prefers-color-scheme: dark)", color: "#121211" }],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'try{const t=localStorage.getItem("richard-resume-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch{}' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
