export default async function SubmitLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <main className="w-full h-[calc(100vh-60px)]">{children}</main>;
}
