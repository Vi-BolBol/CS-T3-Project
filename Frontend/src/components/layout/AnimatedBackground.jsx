/**
 * Ambient motion for the general-user (logged-out) pages.
 *
 * Fixed, behind everything, inert. Colour comes from the accent token via
 * `rgb(var(--c-accent) / …)`, so it re-tints on the theme flip rather than being
 * a hardcoded gradient that only reads well in one mode. Disabled entirely under
 * `prefers-reduced-motion`.
 *
 * Not used on the authenticated student/company/admin pages — those are work
 * surfaces, and drifting colour behind a data table is a distraction.
 */
export default function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="if-grid opacity-40" />

      <div
        className="if-orb if-orb-a h-[38rem] w-[38rem] -left-40 -top-40"
        style={{ background: 'rgb(var(--c-accent) / 0.14)' }}
      />
      <div
        className="if-orb if-orb-b h-[30rem] w-[30rem] -right-32 top-24"
        style={{ background: 'rgb(var(--c-accent) / 0.09)' }}
      />
      <div
        className="if-orb if-orb-c h-[34rem] w-[34rem] bottom-0 left-1/3"
        style={{ background: 'rgb(var(--c-accent) / 0.07)' }}
      />
    </div>
  );
}
