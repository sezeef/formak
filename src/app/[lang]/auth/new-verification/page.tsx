"use client";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { localize } from "@/lib/locale";
import { newVerification } from "@/actions/auth/new-verification";

import { AuthCard } from "@/components/auth-card";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useDictionary } from "@/components/dictionary-context";
import { isAppError } from "@/lib/error";

export default function NewVerificationPage() {
  const { dictionary } = useDictionary();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError(dictionary["auth/new-verification"]["error:no-token"]);
      return;
    }

    newVerification(token)
      .then(({ status }) => {
        if (status === "EMAIL_VERIFIED") {
          setSuccess(
            dictionary["auth/new-verification"]["message:email-verified"]
          );
        }
      })
      .catch(() => {
        if (isAppError(error)) {
          const code = error.message;
          setError(dictionary.error[code]);
        } else {
          setError(dictionary.error.AUTH_UNK_ERR);
        }
      });
  }, [token, success, error, dictionary]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <AuthCard
      headerLabel={dictionary.auth["head:title"]}
      subHeaderLabel={dictionary["auth/new-verification"]["head:sub-title"]}
      backButtonLabel={dictionary.auth["button:back-to-login"]}
      backButtonHref={localize(dictionary.lang, "/auth/login")}
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </AuthCard>
  );
}
