"use client";

import { use, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { newPassword } from "@/actions/auth/new-password";
import { type NewPasswordSchema, newPasswordSchema } from "@/lib/schemas";
import { localize } from "@/lib/locale";
import { useDictionary } from "@/components/dictionary-context";
import { AppError, ERROR_CODES, isAppError } from "@/lib/error";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function NewPasswordPage(props: { searchParams: SearchParams }) {
  const { dictionary } = useDictionary();
  const searchParams = use(props.searchParams);
  const token = searchParams["token"] as string | undefined;

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: ""
    }
  });

  const onSubmit = (values: NewPasswordSchema) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token)
        .then(({ status }) => {
          if (status === "PASSWORD_RESET") {
            setSuccess(
              dictionary["auth/new-password"]["message:reset-success"]
            );
          } else {
            // should be unreachable
            throw new AppError(ERROR_CODES.SYS_INTERNAL_ERR);
          }
        })
        .catch((error) => {
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
      headerLabel={dictionary.auth["head:title"]}
      subHeaderLabel={dictionary["auth/new-password"]["head:sub-title"]}
      backButtonLabel={dictionary.auth["button:back-to-login"]}
      backButtonHref={localize(dictionary.lang, "/auth/login")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dictionary.auth["input.label:password"]}
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
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {dictionary["auth/new-password"]["button:reset-password"]}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
