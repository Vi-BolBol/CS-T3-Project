import { Link } from "react-router-dom";
import Button from "../ui/Button"; 

export default function HeroSection() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-8 py-24 text-center">
      <p className="mb-4 text-greenMain">Find jobs faster</p>

      <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
        Launch Your Career With The Right Opportunity
      </h1>

      <p className="mt-6 max-w-2xl text-gray-300">
        Search jobs, apply easily, manage applications, and create your CV in one platform.
      </p>

      <div className="mt-8 flex gap-4">
        <Button>Find Jobs</Button>
        <Button className="bg-white/10 text-white hover:bg-white/20">
          Create CV
        </Button>
      </div>
    </section>
  );
}