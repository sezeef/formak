"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { localize } from "@/lib/locale";
import { AppError, ERROR_CODES, isAppError } from "@/lib/error";
import { register } from "@/actions/auth/register";
import { type RegisterSchema, registerSchema } from "@/lib/schemas";
import { useDictionary } from "@/components/dictionary-context";

import { AuthCard } from "@/components/auth-card";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

export default function RegisterPage() {
  const { dictionary } = useDictionary();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  });

  const onSubmit = (values: RegisterSchema) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then(({ status }) => {
          if (status === "CONFIRMATION_SENT") {
            setSuccess(dictionary.auth["message:confirm-sent"]);
          } else {
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
      subHeaderLabel={dictionary["auth/register"]["head:sub-title"]}
      backButtonLabel={dictionary["auth/register"]["link:go-to-login"]}
      backButtonHref={localize(dictionary.lang, "/auth/login")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dictionary["auth/register"]["input.label:name"]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {dictionary["auth/register"]["button:register"]}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
