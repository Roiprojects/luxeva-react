import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brand logo — the client's LUXEVACARE horizontal lockup (emblem + wordmark), keyed to a
 * transparent background so it sits cleanly on the light header. On dark surfaces it sits
 * on a white chip so the red/blue keep their contrast.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Luxeva Care — home"
      className={cn(
        "group inline-flex items-center rounded-lg",
        tone === "light" ? "bg-white px-3 py-2 shadow-soft" : "",
        className,
      )}
    >
      <Image
        src="/assets/brand/logo.png"
        alt="Luxeva Care Pvt Ltd"
        width={1871}
        height={441}
        priority
        className="h-8 w-auto md:h-9 transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </Link>
  );
}
