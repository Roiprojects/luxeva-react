import { useLocation, useNavigate } from "react-router-dom";

/** next/navigation shims backed by react-router. */
export function usePathname(): string {
  return useLocation().pathname;
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
  };
}

export function notFound(): never {
  throw new Error("NEXT_NOT_FOUND");
}
