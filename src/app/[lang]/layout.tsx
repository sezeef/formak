import "./globals.css";
import type { Metadata } from "next";
import { i18n, type Locale } from "@/lib/locale";
import { getDictionary } from "@/lib/get-dictionary";
import { DictionaryProvider } from "@/components/dictionary-context";

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
    <html lang={lang} dir={dictionary.dir}>
      <body>
        <DictionaryProvider dictionary={dictionary} locale={lang}>
          {children}
        </DictionaryProvider>
      </body>
    </html>
  );
}
