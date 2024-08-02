export default async function FormsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col w-full h-[calc(100vh-60px)]">
      {children}
    </main>
  );
}
