import Button from "../common/Button";

export default function JobCard({
  title,
  company,
  location,
  type,
  salary,
}) {
  return (
    <div className="rounded-2xl border border-line bg-muted p-6 transition hover:border-accent">

      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-accent/20"></div>

        <div>
          <h3 className="text-xl font-semibold text-content">
            {title}
          </h3>

          <p className="text-subtle">
            {company}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-subtle">
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