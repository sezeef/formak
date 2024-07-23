"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";

const Header = ({
  headerLabel,
  subHeaderLabel
}: {
  headerLabel: string;
  subHeaderLabel?: string;
}) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-2xl font-semibold")}>{headerLabel}</h1>
      <p className="text-muted-foreground text-sm">{subHeaderLabel}</p>
    </div>
  );
};

const BackButton = ({ href, label }: { href: string; label: string }) => {
  return (
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

type AuthCardProps = {
  children: React.ReactNode;
  headerLabel: string;
  subHeaderLabel?: string;
  backButtonLabel: string;
  backButtonHref: string;
};
export const AuthCard = ({
  children,
  headerLabel,
  subHeaderLabel,
  backButtonLabel,
  backButtonHref
}: AuthCardProps) => {
  return (
    <Card className="w-[420px] shadow-md">
      <CardHeader>
        <Header headerLabel={headerLabel} subHeaderLabel={subHeaderLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
