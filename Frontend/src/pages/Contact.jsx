import { Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-darkBlue px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* Shared Global Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between text-xs font-medium text-gray-300 sm:text-sm">
        <Link to="/" className="text-greenMain">
          Internship Finder
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="hover:text-white">Discover</Link>
          <Link to="/company" className="hover:text-white">Application</Link>
          <Link to="/contact" className="hover:text-white text-greenMain">Saved</Link>
        </nav>

        <div className="flex items-center gap-3 text-white/80">
          <span aria-hidden="true">✈</span>
          <span aria-hidden="true">⚙</span>
          <span aria-hidden="true">◌</span>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-10">
        <section className="w-full max-w-2xl rounded-[2rem] border border-[#2D4750] bg-[#111B34] px-6 py-8 shadow-2xl shadow-black/20 sm:px-10 sm:py-10">
          
          {/* Header Typography */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Get in Touch</h1>
            <p className="mt-2 text-sm text-gray-300 sm:text-base">
              Have questions or feedback? We would love to hear from you.
            </p>
          </div>

          {/* Quick Connect Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
              <span className="mb-1 text-lg text-greenMain">✉</span>
              <span className="font-semibold text-white">Email Us</span>
              <span className="text-gray-400 mt-0.5">support@internfinder.com</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
              <span className="mb-1 text-lg text-greenMain">🌐</span>
              <span className="font-semibold text-white">Office Hours</span>
              <span className="text-gray-400 mt-0.5">Mon - Fri, 9AM - 5PM</span>
            </div>
          </div>

          {/* Separation Accent */}
          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative bg-[#111B34] px-3 text-xs text-gray-400 uppercase tracking-wider">
              Send a Message
            </span>
          </div>

          {/* Contact Interactive Form */}
          <form className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-greenMain/90">Your Name</label>
                <Input type="text" placeholder="John Doe" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-greenMain/90">Email Address</label>
                <Input type="email" placeholder="User@gmail.com" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-greenMain/90">Subject</label>
              <Input type="text" placeholder="How can we help you?" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-greenMain/90">Message</label>
              {/* Fallback internal textarea if you don't have a shared component for textareas */}
              <textarea 
                rows={4}
                placeholder="Type your message here..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-greenMain focus:outline-none focus:ring-1 focus:ring-greenMain resize-none"
              />
            </div>

            <Button className="w-full py-3.5 text-sm font-semibold tracking-wide">
              Submit Message
            </Button>
          </form>

          {/* Return Navigation Anchor */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Never mind, take me{" "}
            <Link to="/" className="font-medium text-greenMain hover:underline">
              Back to Home
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}