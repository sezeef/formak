import { DesignerContextProvider } from "@/components/builder/designer-context";

export default async function BuilderLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full h-[calc(100vh-60px)]">
      <DesignerContextProvider>{children}</DesignerContextProvider>
    </main>
  );
}
