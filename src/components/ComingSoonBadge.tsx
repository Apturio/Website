import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Shared "próximamente" / "coming soon" visual treatment for navbar and
 * footer link lists (LINKSTATE-02). Locale-agnostic: the caller resolves the
 * translated label via next-intl and passes it in, so this component stays
 * usable from both client components (Navbar) and server components
 * (Footer, Phase 22).
 */
export function ComingSoonBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("text-muted-foreground", className)}>
      {label}
    </Badge>
  );
}
