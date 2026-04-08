import type { Metadata } from "next";
import "./globals.css";
import ExtensionErrorFilter from "@/components/ExtensionErrorFilter";

export const metadata: Metadata = {
  title: "Michael Jones",
  description: "Personal brand / content / music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: "#000" }}>
      <head>
        <link href="https://fonts.cdnfonts.com/css/vcr-osd-mono" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ margin: 0, padding: 0, overflow: "hidden", background: "#000", minHeight: "100vh" }}>
        <ExtensionErrorFilter />
        {children}
      </body>
    </html>
  );
}
