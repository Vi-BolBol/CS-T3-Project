/**
 * The quarter-width description beside the form. It's narrow by design (the form
 * is twice its width), so it's a headline plus three one-line proof points —
 * not a wall of marketing copy.
 */
export default function RolePitch({ eyebrow, icon, headline, points }) {
  return (
    <div className="if-swap">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
        <i className={`bi ${icon}`} /> {eyebrow}
      </span>

      <h2 className="mt-3 text-xl font-black leading-tight tracking-tight text-content">
        {headline}
      </h2>

      <ul className="mt-4 space-y-2.5">
        {points.map((p) => (
          <li key={p.text} className="flex items-start gap-2 text-xs leading-snug text-subtle">
            <i className={`bi ${p.icon} mt-0.5 flex-shrink-0 text-accent`} />
            {p.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
