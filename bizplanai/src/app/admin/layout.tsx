/**
 * Layout for /admin/* pages. Hides the consumer-facing GlobalNav
 * so admin tooling looks like internal tooling, not part of public site.
 *
 * Root layout renders <GlobalNav /> as <header class="fixed top-0 ...">
 * and wraps content in <div class="pt-14">. We hide both via CSS scoped
 * to admin pages.
 *
 * Auth is enforced by src/middleware.ts (HTTP Basic Auth).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide the consumer-facing GlobalNav on admin pages */
        body > header.fixed.top-0 { display: none !important; }
        /* Remove the pt-14 spacer that root layout adds for the fixed header */
        body > div.pt-14 { padding-top: 0 !important; }
        /* Also hide the chat widget and any floating consumer UI */
        body > button.fixed,
        body > div.fixed { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
