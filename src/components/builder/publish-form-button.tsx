"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { MdOutlinePublish } from "react-icons/md";
import { publishForm as publish } from "@/actions/form/publish-form";
import type { Dictionary } from "@/lib/get-dictionary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { USER_ROLES } from "@/db/schema/user";
import Link from "next/link";
import { localize } from "@/lib/locale";
import { useCurrentUserOrGuest } from "../use-current-user";

export function PublishFormButton({
  id,
  dictionary
}: {
  id: string;
  dictionary: Dictionary;
}) {
  const user = useCurrentUserOrGuest();
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function publishForm() {
    try {
      await publish(id);
      toast({
        title: dictionary.builder["toast.desc:publish-success"],
        description: dictionary.builder["toast.desc:publish-success"]
      });
      router.refresh();
    } catch (error) {
      toast({
        title: dictionary.builder["toast.title:error"],
        description: dictionary.builder["toast.desc:error"]
      });
    }
  }

  const isGuest = user?.role === USER_ROLES.GUEST;

  const dialogContent = isGuest
    ? {
        title: dictionary.builder["dialog.title:guest"],
        description: (
          <>
            {dictionary.builder["dialog.desc:guest-1"]}
            <br />
            <br />
            <span className="font-medium">
              {dictionary.builder["dialog.desc:guest-2"]}
            </span>
          </>
        ),
        action: (
          <>
            <AlertDialogAction asChild>
              <Link href={localize(dictionary.lang, "/auth/login")}>
                {dictionary.builder["dialog.button:login"]}
              </Link>
            </AlertDialogAction>
            <AlertDialogAction asChild>
              <Link href={localize(dictionary.lang, "/auth/register")}>
                {dictionary.builder["dialog.button:join-formak"]}
              </Link>
            </AlertDialogAction>
          </>
        )
      }
    : {
        title: dictionary.builder["dialog.title:publish-form"],
        description: (
          <>
            {dictionary.builder["dialog.desc:publish-form-1"]} <br />
            <br />
            <span className="font-medium">
              {dictionary.builder["dialog.desc:publish-form-2"]}
            </span>
          </>
        ),
        action: (
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(publishForm);
            }}
          >
            {dictionary.builder["dialog.button:proceed"]}{" "}
            {loading && <FaSpinner className="animate-spin" />}
          </AlertDialogAction>
        )
      };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400">
          <MdOutlinePublish className="h-4 w-4" />
          {dictionary.builder["button:publish"]}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogContent.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {dictionary.builder["dialog.button:cancel"]}
          </AlertDialogCancel>
          {dialogContent.action}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
