import LocaleSwitcher from "@/components/lang-switcher";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/middleware";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <main>
      <div>
        <h2>Current langague: {lang}</h2>
        <p>
          This text is rendered on the server:{" "}
          {dictionary["server-component"].welcome}
        </p>
      </div>
      <br />
      <LocaleSwitcher />
    </main>
  );
}
