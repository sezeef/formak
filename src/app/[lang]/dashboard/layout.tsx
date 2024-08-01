export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
}
