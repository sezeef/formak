"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { localize } from "@/lib/locale";
import { authClient } from "@/lib/auth-client";
import { type RegisterSchema, registerSchema } from "@/lib/schemas";
import { useDictionary } from "@/components/dictionary-context";
import { transferAnonymousForms } from "@/actions/form/transfer-anonymous-forms";

import { AuthCard } from "@/components/auth-card";
import { FormError } from "@/components/form-error";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const { dictionary } = useDictionary();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  });

  const onSubmit = async (values: RegisterSchema) => {
    setError("");
    setIsPending(true);

    try {
      // Check if there's an existing anonymous session
      const currentSession = await authClient.getSession();
      const oldUserId = currentSession?.data?.user?.id;
      const isAnonymous = currentSession?.data?.user?.isAnonymous;

      // Register new user
      const result = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (result.error) {
        if (result.error.message?.includes("already exists") || result.error.message?.includes("duplicate")) {
          setError(dictionary.error.AUTH_EXISTING_EMAIL);
        } else {
          setError(dictionary.error.SYS_DB_FAILURE);
        }
      } else {
        // If user was anonymous and had forms, transfer them to new account
        if (oldUserId && isAnonymous && result.data?.user?.id) {
          await transferAnonymousForms(oldUserId, result.data.user.id);
        }

        // Redirect on successful registration
        router.push(localize(dictionary.lang, "/dashboard"));
        router.refresh();
      }
    } catch {
      setError(dictionary.error.AUTH_UNK_ERR);
    } finally {
      setIsPending(false);
    }
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
          <Button disabled={isPending} type="submit" className="w-full">
            {dictionary["auth/register"]["button:register"]}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
