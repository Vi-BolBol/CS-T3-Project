import Button from "../common/Button";

export default function CVCard({
  title,
  image,
  onSelect,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-muted">

      <div className="h-80 bg-muted">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-subtle">
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