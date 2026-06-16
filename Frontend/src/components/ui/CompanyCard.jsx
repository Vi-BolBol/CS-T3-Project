import Button from "../common/Button";

export default function CompanyCard({
  name,
  industry,
  location,
  jobs,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

      <div className="h-16 w-16 rounded-2xl bg-greenMain/20"></div>

      <h3 className="mt-4 text-2xl font-bold">
        {name}
      </h3>

      <p className="mt-2 text-gray-400">
        {industry}
      </p>

      <p className="mt-1 text-gray-400">
        📍 {location}
      </p>

      <p className="mt-4 text-greenMain">
        {jobs} Open Positions
      </p>

      <Button className="mt-6 w-full">
        View Company
      </Button>
    </div>
  );
}