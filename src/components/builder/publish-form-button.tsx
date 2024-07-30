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

export function PublishFormButton({
  id,
  dictionary
}: {
  id: string;
  dictionary: Dictionary;
}) {
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
          <AlertDialogTitle>
            {dictionary.builder["dialog.title:publish-form"]}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dictionary.builder["dialog.desc:publish-form-1"]} <br />
            <br />
            <span className="font-medium">
              {dictionary.builder["dialog.desc:publish-form-2"]}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {dictionary.builder["dialog.button:cancel"]}
          </AlertDialogCancel>
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
