export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-greenMain ${className}`}
      {...props}
    />
  );
}