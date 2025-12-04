"use server";
import { sql, eq, and, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { formTable, type InsertForm } from "@/db/schema/form";
import { formSubmissionTable } from "@/db/schema/form-submission";

export async function createForm(data: InsertForm) {
  try {
    const db = await getDb();

    // Try to insert with original name first
    try {
      return await db
        .insert(formTable)
        .values(data)
        .returning({ formId: formTable.id })
        .get();
    } catch (insertError: any) {
      // If UNIQUE constraint fails, append a number to the name
      if (insertError?.code === 'SQLITE_CONSTRAINT') {
        // Find the highest number suffix for this user and base name
        const existingForms = await db
          .select({ name: formTable.name })
          .from(formTable)
          .where(eq(formTable.userId, data.userId))
          .all();

        const baseName = data.name;
        const pattern = new RegExp(`^${baseName}(?: \\((\\d+)\\))?$`);
        let maxNumber = 0;

        for (const form of existingForms) {
          const match = form.name.match(pattern);
          if (match) {
            const num = match[1] ? parseInt(match[1]) : 0;
            maxNumber = Math.max(maxNumber, num);
          }
        }

        // Create with new number suffix
        const newName = `${baseName} (${maxNumber + 1})`;
        return await db
          .insert(formTable)
          .values({ ...data, name: newName })
          .returning({ formId: formTable.id })
          .get();
      }
      throw insertError;
    }
  } catch (error) {
    console.error("Failed to create form: ", error);
    throw error;
  }
}

export async function getAllFormsByUserId(userId: string) {
  try {
    const db = await getDb();
    return await db
      .select()
      .from(formTable)
      .where(sql`${formTable.userId} = ${userId}`)
      .orderBy(desc(formTable.createdAt))
      .all();
  } catch (error) {
    console.error("Failed to fetch forms: ", error);
  }
}

export async function getFormStatsByUserId(userId: string) {
  try {
    const db = await getDb();
    return await db
      .select({
        totalVisits: sql<number>`sum(${formTable.visits})`,
        totalSubmissions: sql<number>`sum(${formTable.submissions})`
      })
      .from(formTable)
      .where(sql`${formTable.userId} = ${userId}`)
      .get();
  } catch (error) {
    console.error("Failed to fetch form stats: ", error);
  }
}

export async function getFormById({
  formId,
  userId
}: {
  formId: string;
  userId: string;
}) {
  try {
    const db = await getDb();
    return await db
      .select()
      .from(formTable)
      .where(and(eq(formTable.id, formId), eq(formTable.userId, userId)))
      .get();
  } catch (error) {
    console.error("Failed to fetch form: ", error);
  }
}

export async function publishFormById({
  formId,
  userId
}: {
  formId: string;
  userId: string;
}) {
  try {
    const db = await getDb();
    const res = await db
      .update(formTable)
      .set({ published: true })
      .where(and(eq(formTable.userId, userId), eq(formTable.id, formId)));

    return res.rowsAffected >= 1;
  } catch (error) {
    console.error("Failed to publish form: ", error);
  }
}

export async function updateFormContentById({
  formId,
  userId,
  content
}: {
  formId: string;
  userId: string;
  content: string;
}) {
  try {
    const db = await getDb();
    const res = await db
      .update(formTable)
      .set({ content })
      .where(and(eq(formTable.userId, userId), eq(formTable.id, formId)));

    return res.rowsAffected >= 1;
  } catch (error) {
    console.error("Failed to publish form: ", error);
  }
}

export async function getFormWithSubmissionsById({
  formId
}: {
  formId: string;
}) {
  try {
    const db = await getDb();
    const res = await db
      .select({
        form: formTable,
        submissions: formSubmissionTable
      })
      .from(formTable)
      .leftJoin(
        formSubmissionTable,
        eq(formTable.id, formSubmissionTable.formId)
      )
      .where(eq(formTable.id, formId));

    if (res.length === 0) {
      return;
    }

    const form = res[0].form;
    const submissions = res.map((r) => r.submissions).filter((s) => s != null);

    return {
      ...form,
      submissions
    };
  } catch (error) {
    console.error("Failed to fetch form with submissions: ", error);
  }
}

export async function updateFormAndCreateSubmission({
  formUrl,
  content
}: {
  formUrl: string;
  content: string;
}) {
  const db = await getDb();
  // First, update the form
  const updatedForms = await db
    .update(formTable)
    .set({
      submissions: sql`${formTable.submissions} + 1`
    })
    .where(and(eq(formTable.shareUrl, formUrl), eq(formTable.published, true)))
    .returning();

  if (updatedForms.length === 0) {
    throw new Error("Form not found or not published");
  }

  const updatedForm = updatedForms[0];

  // Then, create the new submission
  const newSubmission = await db
    .insert(formSubmissionTable)
    .values({
      formId: updatedForm.id,
      content: content
    })
    .returning();

  return {
    ...updatedForm,
    newSubmission: newSubmission[0]
  };
}
