export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-lg bg-greenMain px-5 py-2 font-semibold text-darkBlue transition hover:bg-greenMain/90 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}