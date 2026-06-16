import Button from "../common/Button";

export default function JobCard({
  title,
  company,
  location,
  type,
  salary,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-greenMain">

      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-greenMain/20"></div>

        <div>
          <h3 className="text-xl font-semibold text-white">
            {title}
          </h3>

          <p className="text-gray-400">
            {company}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-gray-300">
        <p>📍 {location}</p>
        <p>💼 {type}</p>
        <p>💰 {salary}</p>
      </div>

      <Button className="mt-6 w-full">
        Apply Now
      </Button>
    </div>
  );
}