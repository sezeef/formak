import { DesignerContextProvider } from "@/components/builder/designer-context";

export default async function BuilderLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <main className="flex w-full flex-grow">
        <div className="flex w-full flex-grow mx-auto">
          <DesignerContextProvider>{children}</DesignerContextProvider>
        </div>
      </main>
    </div>
  );
}
