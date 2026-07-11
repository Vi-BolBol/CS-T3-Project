export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-line bg-raised/5 p-5 ${className}`}>
      {children}
    </div>
  );
}