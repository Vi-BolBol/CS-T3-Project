import { Link } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Login() {
  return (
    <div className="min-h-screen bg-darkBlue px-4 py-6 text-white sm:px-6 lg:px-8">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between text-xs font-medium text-gray-300 sm:text-sm">
        <Link to="/" className="text-greenMain">
          Internship Finder
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="hover:text-white">Discover</Link>
          <Link to="/company" className="hover:text-white">Application</Link>
          <Link to="/contact" className="hover:text-white">Saved</Link>
        </nav>

     
      </header>

      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-10">
        <section className="w-full max-w-md rounded-[2rem] border border-[#2D4750] bg-[#111B34] px-6 py-8 shadow-2xl shadow-black/20 sm:px-8 sm:py-10">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-300 sm:text-base">Sign in to Continue your Journey</p>
          </div>

          <div className="mt-6 flex rounded-full bg-white/5 p-1 text-sm">
            <Link
              to="/login"
              className="flex-1 rounded-full bg-greenMain px-4 py-2 text-center font-medium text-darkBlue"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="flex-1 rounded-full px-4 py-2 text-center font-medium text-gray-300 transition hover:text-white"
            >
              Sign Up
            </Link>
          </div>

          <form className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-greenMain/90">Email Address</label>
              <Input type="email" placeholder="User@gmail.com" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-greenMain/90">Password</label>
              <Input type="password" placeholder="••••••••••••" />
            </div>

            <div className="flex justify-end text-xs font-medium text-greenMain">
              <button type="button" className="hover:underline">Forget password ?</button>
            </div>

            <Button className="w-full py-3 text-sm">Sign In</Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">or continue with</p>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <button
              type="button"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-gray-200 transition hover:border-greenMain hover:text-white"
            >
              Google
            </button>
            <button
              type="button"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-gray-200 transition hover:border-greenMain hover:text-white"
            >
              GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-medium text-greenMain hover:underline">
              Sign up
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}