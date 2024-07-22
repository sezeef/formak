import LocaleSwitcher from "@/components/lang-switcher";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/locale";

export default async function Home({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const session = await auth();
  return (
    <main>
      <div>
        <h2>Current langague: {lang}</h2>
        <p>
          This text is rendered on the server: {dictionary["/"]["body:welcome"]}
        </p>
        <p>{JSON.stringify(session?.user)}</p>
      </div>
      <br />
      <LocaleSwitcher />
    </main>
  );
}
