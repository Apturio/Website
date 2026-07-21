import { getTranslations, getLocale } from "next-intl/server";

import { NavbarClient } from "@/components/NavbarClient";
import { getNavigationView } from "@/lib/navigation";

// Thin async Server Component: fetches the resolved NavigationView (editable
// Payload Global, falling back silently to the static emergency registry on
// DB failure — see lib/navigation.ts) and hands it to NavbarClient as a
// prop. Navbar takes NO props of its own so the 11 existing `<Navbar />`
// call sites in src/app stay unchanged (NAVCMS-05).
export async function Navbar() {
  const t = await getTranslations();
  const language = await getLocale();
  const view = await getNavigationView(language, t);

  return <NavbarClient view={view} />;
}
