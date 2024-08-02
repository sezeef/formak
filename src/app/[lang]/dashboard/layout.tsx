export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <main className="w-full h-[calc(100vh-60px)]">{children}</main>;
}
