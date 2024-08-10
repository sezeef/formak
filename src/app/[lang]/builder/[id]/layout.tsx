import { DesignerContextProvider } from "@/components/builder/designer-context";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export default async function BuilderLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <main className="flex w-full h-[calc(100vh-60px)]">
        <DesignerContextProvider>{children}</DesignerContextProvider>
      </main>
    </SessionProvider>
  );
}
