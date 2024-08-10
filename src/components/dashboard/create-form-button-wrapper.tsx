"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImSpinner2 } from "react-icons/im";

import { create } from "@/actions/form/create";

import { useDictionary } from "@/components/dictionary-context";
import type { Locale } from "@/lib/locale";
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

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  });

  async function onSubmit(values: FormSchema) {
    try {
      await create(values, dictionary.lang as Locale);
      toast({
        title: dictionary.dashboard["toast.title:success"],
        description: dictionary.dashboard["toast.desc:success"]
      });
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        // This is a redirect, not an error. Re-throw it.
        throw error;
      }
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
