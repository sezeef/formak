import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Formak",
  description: "Build and publish your own forms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
