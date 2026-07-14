export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-line bg-raised p-5 ${className}`}>
      {children}
    </div>
  );
}
