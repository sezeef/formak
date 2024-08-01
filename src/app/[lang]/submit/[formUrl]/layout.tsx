export default async function SubmitLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-w-full bg-background">
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
}
