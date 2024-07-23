import { getDictionary } from "@/lib/get-dictionary";
import { localize, type Locale } from "@/lib/locale";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { AuthCard } from "@/components/auth-card";

export default async function AuthErrorPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <AuthCard
      headerLabel={dictionary["auth/error"]["head:oops"]}
      backButtonLabel={dictionary["auth"]["button:back-to-login"]}
      backButtonHref={localize(lang, "/auth/login")}
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </AuthCard>
  );
}
