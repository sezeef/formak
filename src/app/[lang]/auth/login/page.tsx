"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "@/actions/auth/login";
import { loginSchema, type LoginSchema } from "@/lib/schemas";
import { localize } from "@/lib/locale";
import { AppError, ERROR_CODES, isAppError } from "@/lib/error";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { AuthCard } from "@/components/auth-card";
import { useDictionary } from "@/components/dictionary-context";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export default function LoginPage() {
  const { dictionary } = useDictionary();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? dictionary["auth/login"]["error:registered-with-different-provider"]
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: LoginSchema) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then(({ status }) => {
          if (status === "VERIFICATION_SENT") {
            form.reset();
            setSuccess(dictionary.auth["message:confirm-sent"]);
          }else if (status === "2FA_SENT") {
            setShowTwoFactor(true);
          } else {
            // should be unreachable
            throw new AppError(ERROR_CODES.SYS_INTERNAL_ERR);
          }
        })
        .catch((error) => {
          form.reset();
          if (isAppError(error)) {
            const code = error.message;
            setError(dictionary.error[code]);
          } else {
            setError(dictionary.error.AUTH_UNK_ERR);
          }
        });
    });
  };

  return (
    <AuthCard
      headerLabel={dictionary["auth"]["head:title"]}
      subHeaderLabel={dictionary["auth/login"]["head:sub-title"]}
      backButtonLabel={dictionary["auth/login"]["link:go-to-register"]}
      backButtonHref={localize(dictionary.lang, "/auth/register")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {dictionary["auth/login"]["input.label:two-factor-code"]}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {dictionary["auth"]["input.label:email"]}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="john.doe@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {dictionary["auth"]["input.label:password"]}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link
                          href={localize(
                            dictionary.lang,
                            "/auth/reset-password"
                          )}
                        >
                          {dictionary["auth/login"]["link:forgot-password"]}
                        </Link>
                      </Button>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {showTwoFactor
              ? dictionary["auth/login"]["button:confirm"]
              : dictionary["auth/login"]["button:login"]}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
