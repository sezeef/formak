"use server";
import { createForm } from "@/db/query/form";

export async function createFormForUser(data: {
  userId: string;
  name: string;
  description: string;
}) {
  return await createForm(data);
}
