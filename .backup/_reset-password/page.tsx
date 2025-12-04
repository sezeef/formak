"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { reset } from "@/actions/auth/reset-password";
import { type ResetSchema, resetSchema } from "@/lib/schemas";
import { localize } from "@/lib/locale";
import { AppError, ERROR_CODES, isAppError } from "@/lib/error";
import { useDictionary } from "@/components/dictionary-context";

import { AuthCard } from "@/components/auth-card";
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
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const { dictionary } = useDictionary();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetSchema>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = (values: ResetSchema) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values)
        .then(({ status }) => {
          if (status === "REST_EMAIL_SENT") {
            setSuccess(
              dictionary["auth/reset-password"]["message:reset-email-sent"]
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
      subHeaderLabel={dictionary["auth/reset-password"]["head:sub-title"]}
      backButtonLabel={dictionary.auth["button:back-to-login"]}
      backButtonHref={localize(dictionary.lang, "/auth/login")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.auth["input.label:email"]}</FormLabel>
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {dictionary["auth/reset-password"]["button:reset-password"]}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
