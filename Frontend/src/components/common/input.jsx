export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-line bg-raised/5 px-4 py-3 text-content outline-none placeholder:text-subtle focus:border-greenMain ${className}`}
      {...props}
    />
  );
}