import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type SiteLogoProps = {
  className?: string;
};

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Link href="/" className={cn("flex shrink-0 items-center", className)} aria-label="hellointerviewai.com home">
      <Image
        src="/logo.svg"
        alt="hellointerviewai.com"
        width={220}
        height={38}
        className="hidden h-8 w-auto sm:block"
        priority
      />
      <Image
        src="/logo-icon.svg"
        alt="hellointerviewai.com"
        width={36}
        height={36}
        className="h-9 w-9 sm:hidden"
        priority
      />
    </Link>
  );
}
