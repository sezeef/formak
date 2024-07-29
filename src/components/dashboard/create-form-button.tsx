"use client";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImSpinner2 } from "react-icons/im";
import { BsFileEarmarkPlus } from "react-icons/bs";

import { create } from "@/actions/form/create";
import { useDictionary } from "@/components/dictionary-context";
import { localize } from "@/lib/locale";
import { formSchema } from "@/lib/schemas";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

export function CreateFormButton() {
  const { dictionary } = useDictionary();
  const router = useRouter();

  type formSchemaType = z.infer<typeof formSchema>;

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema)
  });

  async function onSubmit(values: formSchemaType) {
    try {
      const { formId } = await create(values);
      toast({
        title: dictionary.dashboard["toast.title:success"],
        description: dictionary.dashboard["toast.desc:success"]
      });
      router.push(localize(dictionary.lang, `/builder/${formId}`));
    } catch (error) {
      toast({
        title: dictionary.dashboard["toast.title:error"],
        description: dictionary.dashboard["toast.desc:error"],
        variant: "destructive"
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="group border-2 border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
        >
          <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">
            {dictionary.dashboard["dialog.title:create-form"]}
          </p>
        </Button>
      </DialogTrigger>
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
