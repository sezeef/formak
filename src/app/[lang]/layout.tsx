import "./globals.css";
import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";

import { i18n, type Locale } from "@/lib/locale";
import { getDictionary } from "@/lib/get-dictionary";

import { cn } from "@/lib/utils";
import { DictionaryProvider } from "@/components/dictionary-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-roboto"
});

const roboto_slab = Roboto_Slab({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-slab"
});

export const metadata: Metadata = {
  title: "Formak",
  description: "Build and publish your own forms."
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

type Params = Promise<{ lang: Locale }>;

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={dictionary.dir}
      className={`${roboto.variable} ${roboto_slab.variable}`}
      suppressHydrationWarning
    >
      <body className={cn("bg-background font-roboto")}>
        <DictionaryProvider dictionary={dictionary} locale={lang}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar dictionary={dictionary} />
            {children}
            <Toaster />
          </ThemeProvider>
        </DictionaryProvider>
      </body>
    </html>
  );
}
