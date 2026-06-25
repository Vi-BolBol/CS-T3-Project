import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-darkBlue text-white">

      <h1 className="text-8xl font-bold text-greenMain">
        404
      </h1>

      <h2 className="mt-4 text-3xl font-semibold">
        Page Not Found
      </h2>

      <p className="mt-3 text-gray-400">
        The page you are looking for does not exist.
      </p>

      <Link to="/" className="mt-8">
        <Button>Back Home</Button>
      </Link>
    </div>
  );
}