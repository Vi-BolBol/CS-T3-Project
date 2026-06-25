import Button from "../common/Button";

export default function CVCard({
  title,
  image,
  onSelect,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">

      <div className="h-80 bg-white/10">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            CV Preview
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold">
          {title}
        </h3>

        <Button
          className="mt-4 w-full"
          onClick={onSelect}
        >
          Use Template
        </Button>
      </div>
    </div>
  );
}