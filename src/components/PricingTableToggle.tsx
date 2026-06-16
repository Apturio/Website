"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

// Small client island: holds the open/closed state for the feature-comparison
// table. The table itself is a Server Component passed in as `children`.
export function PricingTableToggle({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="mt-12 text-center">
      <Button
        onClick={() => setShowTable(!showTable)}
        className="bg-white text-black hover:bg-slate-200 font-bold gap-3 text-xl px-10 py-8 rounded-full transition-all duration-300 shadow-2xl border-none"
      >
        {label}
        {showTable ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
      </Button>

      {showTable && <div className="animate-fade-in-up">{children}</div>}
    </div>
  );
}
