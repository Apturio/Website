import { Rocket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Presentational "$2,000 Implementation Advantage" card. Shared by the Footer
// (i18n-driven, shown on all non-home pages) and the CtaBlock (Payload-driven,
// the final block on the home). Markup is identical to the original Footer card.
export function AdvantageCTA({
  badge,
  title,
  body,
  goal,
  safety,
  cancelAnytime,
  buttonLabel,
  buttonHref,
}: {
  badge?: string | null;
  title?: string | null;
  body?: string | null;
  goal?: string | null;
  safety?: string | null;
  cancelAnytime?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
}) {
  return (
    <div className="relative max-w-4xl mx-auto mb-16 bg-background rounded-[20px] p-8 border border-primary/40 shadow-[0_0_30px_rgba(120,125,255,0.15)] text-center">
      <div className="absolute -top-4 right-4 md:-right-4 px-4 py-1.5 bg-background border border-[#37ca37] text-[#37ca37] text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(55,202,55,0.4)] whitespace-nowrap z-10">
        {badge}
      </div>
      <Rocket className="h-12 w-12 text-primary mx-auto mb-4 drop-shadow-[0_0_10px_rgba(120,125,255,0.5)]" />
      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#FFFFFF]">{title}</h3>
      <p className="text-[#94a3b8] text-lg mb-4 max-w-2xl mx-auto">
        {body}
      </p>
      <p className="text-[#FFFFFF] text-lg mb-2 font-medium max-w-2xl mx-auto">
        {goal}
      </p>
      <p className="text-[#37ca37] text-base mb-6 font-semibold max-w-2xl mx-auto drop-shadow-[0_0_8px_rgba(55,202,55,0.4)]">
        {safety}
      </p>
      <p className="text-sm font-medium text-[#94a3b8] uppercase tracking-widest">
        {cancelAnytime}
      </p>
      {buttonLabel && buttonHref && (
        <div className="mt-6">
          <Button asChild className="rounded-full font-bold px-8">
            <Link href={buttonHref}>{buttonLabel}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
