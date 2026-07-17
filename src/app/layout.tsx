import type { Metadata } from "next";
import "./globals.css";

const title = "Richard's Terminal";
const description = "Richard's terminal-style personal homepage and project index.";
const siteUrl = new URL("https://pmrichq.com");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "256x256" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    images: [{ url: "/og.png", width: 1659, height: 948 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://vibeloft.ai/telemetry/v1.js"
          data-vl-product-id="a6ce40d7-03fc-4948-9923-f4e89efb26a8"
          data-vl-auth-key="vl_web.ACiOBBK-QNHOesd8XDDTk7Bs86kP5vsrnr2dhx80swM"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
