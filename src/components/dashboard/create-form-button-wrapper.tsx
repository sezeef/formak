"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ImSpinner2 } from "react-icons/im";

import { authClient } from "@/lib/auth-client";
import { createFormForUser } from "@/actions/form/create-for-user";

import { useDictionary } from "@/components/dictionary-context";
import { localize } from "@/lib/locale";
import { type FormSchema, formSchema } from "@/lib/schemas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

export function CreateFormButtonWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const { dictionary } = useDictionary();
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  async function onSubmit(values: FormSchema) {
    try {
      // Check if user is already logged in
      const session = await authClient.getSession();

      let userId: string;

      if (session?.data?.user) {
        // User is already logged in
        userId = session.data.user.id;
      } else {
        // Sign in anonymously
        const result = await authClient.signIn.anonymous();

        if (result.error || !result.data?.user) {
          throw new Error("Failed to create anonymous session");
        }

        userId = result.data.user.id;
      }

      // Create the form with the user ID
      const formResult = await createFormForUser({
        userId,
        name: values.name,
        description: values.description || ""
      });

      if (!formResult?.formId) {
        throw new Error("Failed to create form");
      }

      toast({
        title: dictionary.dashboard["toast.title:success"],
        description: dictionary.dashboard["toast.desc:success"]
      });

      // Redirect to builder and refresh to update navbar
      router.push(localize(dictionary.lang, `/builder/${formResult.formId}`));
      router.refresh();
    } catch {
      toast({
        title: dictionary.dashboard["toast.title:error"],
        description: dictionary.dashboard["toast.desc:error"],
        variant: "destructive"
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>
            {dictionary.dashboard["dialog.title:create-form"]}
          </DialogTitle>
          <DialogDescription>
            {dictionary.dashboard["dialog.desc:create-form"]}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dictionary.dashboard["dialog.input.label:name"]}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dictionary.dashboard["dialog.input.label:description"]}
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="w-full mt-4"
          >
            {!form.formState.isSubmitting && (
              <span>{dictionary.dashboard["dialog.button:save"]}</span>
            )}
            {form.formState.isSubmitting && (
              <ImSpinner2 className="animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
