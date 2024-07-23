import { Suspense } from "react";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <div className="h-screen flex items-center justify-center">
        {children}
      </div>
    </Suspense>
  );
}
