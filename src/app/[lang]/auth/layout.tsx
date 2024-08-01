import { Suspense } from "react";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <div className="mt-16 flex justify-center">{children}</div>
    </Suspense>
  );
}
