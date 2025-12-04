"use client";

import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginSchema } from "@/lib/schemas";
import { localize } from "@/lib/locale";
import { useDictionary } from "@/components/dictionary-context";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function LoginPage(props: { searchParams: SearchParams }) {
  const { dictionary } = useDictionary();
  const router = useRouter();
  const searchParams = use(props.searchParams);
  const callbackUrl = searchParams["callbackUrl"] as string | undefined;
  const urlError =
    searchParams["error"] === "OAuthAccountNotLinked"
      ? dictionary["auth/login"]["error:registered-with-different-provider"]
      : "";

  const [error, setError] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: LoginSchema) => {
    setError("");
    setIsPending(true);

    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        setError(dictionary.error.AUTH_INVALID_CRED);
        form.reset();
      } else {
        // Redirect on successful login
        router.push(callbackUrl || localize(dictionary.lang, "/dashboard"));
      }
    } catch {
      setError(dictionary.error.AUTH_UNK_ERR);
      form.reset();
    } finally {
      setIsPending(false);
    }
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
                  {/* Password reset disabled for now */}
                  {/* <Button
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
                  </Button> */}
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError} />
          <Button disabled={isPending} type="submit" className="w-full">
            {dictionary["auth/login"]["button:login"]}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
