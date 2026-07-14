import Button from "../common/Button";

export default function CompanyCard({
  name,
  industry,
  location,
  jobs,
}) {
  return (
    <div className="rounded-2xl border border-line bg-muted p-6">

      <div className="h-16 w-16 rounded-2xl bg-accent/20"></div>

      <h3 className="mt-4 text-2xl font-bold">
        {name}
      </h3>

      <p className="mt-2 text-subtle">
        {industry}
      </p>

      <p className="mt-1 text-subtle">
        📍 {location}
      </p>

      <p className="mt-4 text-accent">
        {jobs} Open Positions
      </p>

      <Button className="mt-6 w-full">
        View Company
      </Button>
    </div>
  );
}