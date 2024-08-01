import "./globals.css";
import type { Metadata } from "next";
import { i18n, type Locale } from "@/lib/locale";
import { getDictionary } from "@/lib/get-dictionary";
import { DictionaryProvider } from "@/components/dictionary-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Roboto, Roboto_Slab } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

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

export default async function RootLayout({
  children,
  params: { lang }
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
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
