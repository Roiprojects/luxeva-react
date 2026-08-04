import { Link as RouterLink } from "react-router-dom";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: ReactNode };

/** next/link shim → react-router Link (external / hash / mail / tel fall back to <a>). */
export default function Link({ href, children, ...rest }: Props) {
  const external = /^(https?:|mailto:|tel:)/.test(href) || rest.target === "_blank";
  if (external || href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  // react-router Link accepts the same common props (className, style, aria-*, onClick…)
  return (
    <RouterLink to={href} {...(rest as Record<string, unknown>)}>
      {children}
    </RouterLink>
  );
}
