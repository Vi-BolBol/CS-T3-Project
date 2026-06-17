import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import HeroSection from "../components/layout/HeroSection";
import Footer from "../components/layout/Footer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070B19] text-white selection:bg-greenMain selection:text-darkBlue">
      <Header />

      {/* Hero Wrapper */}
      <HeroSection />

      {/* 1. Premium Linear Statistics Banner */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#0B132B]/80 backdrop-blur-md sm:grid-cols-3 sm:divide-y-0 sm:divide-x py-6 shadow-xl">
          <div className="text-center p-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-white">2026</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-greenMain/80">Established</p>
          </div>
          <div className="text-center p-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-greenMain">94%</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Employed Rate</p>
          </div>
          <div className="text-center p-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-white">45+</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Agencies Linked</p>
          </div>
        </div>
      </section>

      {/* 2. Transparent Foundations Features Grid */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built on Transparent Foundations</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
            Our commitment to quality and absolute integrity in every internship placement.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Career Growth", text: "84% of our interns receive full-time offers or advance their careers significantly within months.", icon: "📈" },
            { title: "Dedicated Mentorship", text: "Every intern is paired with an experienced industry professional mentor to guide their journey.", icon: "👥" },
            { title: "Verified Companies", text: "All partner companies are thoroughly vetted for legitimate opportunities and fair compensation.", icon: "🛡️" },
            { title: "Quality Standards", text: "We maintain strict standards for intern treatment, ensuring a safe and productive environment.", icon: "💎" }
          ].map((feat) => (
            <Card key={feat.title} className="border border-white/5 bg-[#111B34]/40 p-5 rounded-2xl hover:border-greenMain/30 transition-all duration-300">
              <span className="text-xl p-2 inline-block bg-white/5 rounded-xl text-greenMain mb-4">{feat.icon}</span>
              <h3 className="text-lg font-bold tracking-tight text-white">{feat.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">{feat.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Editorial Spotlight / Feature Insights (As structured in image_4bde38.png) */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1 flex flex-col justify-center text-left">
          <h2 className="text-2xl font-bold tracking-tight text-white">Built on transparent Foundations</h2>
          <p className="mt-3 text-xs leading-relaxed text-gray-400">
            We stand against exploitation. We optimize for pure professional application and skill building.
          </p>
          <Link to="/discover" className="mt-4 text-xs font-semibold text-greenMain hover:underline inline-flex items-center gap-1">
            Learn More <span>→</span>
          </Link>
        </div>

        {[
          { title: "Bringing the Gap Statement", category: "OFFICE", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80" },
          { title: "Applied Learning Strategy Innovation", category: "SKILL TRAC", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" },
          { title: "Turning Teams into Full-Time Hires", category: "GROWTH", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80" }
        ].map((item, idx) => (
          <div key={idx} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111B34]/60 transition hover:border-white/20">
            <div className="h-36 overflow-hidden bg-gray-800">
              <img src={item.img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105 opacity-80" />
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-greenMain">{item.category}</span>
              <h4 className="mt-1 text-sm font-semibold tracking-tight text-white line-clamp-2">{item.title}</h4>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Verified Success Stories Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Success Stories</h2>
          <p className="mt-2 text-sm text-gray-400">Hear from our alumni who launched their careers through our platform</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[
            {
              quote: "The internship program helped me transition from student to professional seamlessly. The mentorship was invaluable and directly led to my current role.",
              author: "Sarah Chen", role: "Software Engineer at Google", desc: "Internship started: Winter 2025"
            },
            {
              quote: "Finding the right fit was always stressful until I used this platform. The verified companies gave me peace of mind, and the process was incredibly smooth.",
              author: "Marcus Johnson", role: "Data Analyst at Spotify", desc: "Internship started: Fall 2025"
            }
          ].map((story, i) => (
            <Card key={i} className="border border-white/5 bg-[#111B34]/30 p-6 sm:p-8 rounded-[1.5rem] flex flex-col justify-between">
              <div>
                <div className="text-greenMain text-sm tracking-widest mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-sm italic leading-relaxed text-gray-300">"{story.quote}"</p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="h-10 w-10 rounded-full bg-greenMain/20 flex items-center justify-center font-bold text-greenMain text-sm">
                  {story.author[0]}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{story.author}</h4>
                  <p className="text-xs text-greenMain">{story.role}</p>
                  <p className="text-[11px] text-gray-500">{story.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="secondary" className="px-6 py-2 text-xs border border-white/10 bg-white/5 hover:bg-white/10 rounded-full">
            View All Stories
          </Button>
        </div>
      </section>

      {/* 5. Split Hub - Explore Opportunities */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Explore Opportunities</h2>
          <p className="mt-2 text-sm text-gray-400">Find the perfect role to kickstart your professional journey</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { title: "Software Engineering", desc: "Frontend, Backend and Full-stack roles at leading tech firms.", icon: "💻" },
            { title: "Product Design", desc: "UI/UX and Product Design opportunities in creative environments.", icon: "🎨" },
            { title: "Data Science", desc: "Analyze complex datasets and build models for global impact.", icon: "📊" }
          ].map((track) => (
            <Card key={track.title} className="border border-white/5 bg-[#111B34]/50 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-lg p-2 inline-block bg-white/5 rounded-xl text-greenMain mb-4">{track.icon}</span>
                <h3 className="text-lg font-bold tracking-tight text-white">{track.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">{track.desc}</p>
              </div>
              <Link to="/company" className="mt-5 text-xs font-semibold text-greenMain hover:underline inline-flex items-center gap-1">
                View Roles <span>→</span>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. Built-in Adaptive Contact Form Section */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 border-t border-white/5">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Get in Touch</h2>
            <p className="mt-3 text-sm text-gray-400 max-w-md leading-relaxed">
              Have questions about our internship programs or the application process? Our team is here to help you navigate your career path.
            </p>
            <div className="mt-6 space-y-3 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-greenMain">✉</span> support@internshipfinder.com
              </div>
              <div className="flex items-center gap-2">
                <span className="text-greenMain">📍</span> Global Virtual Headquarters
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111B34]/60 p-6 sm:p-8 shadow-xl">
            <form className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">Email Address</label>
                <Input type="email" placeholder="your@email.com" className="bg-[#070B19]/60" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">Your Question/Feedback</label>
                <textarea 
                  rows={4}
                  placeholder="How can we assist you?"
                  className="w-full rounded-xl border border-white/10 bg-[#070B19]/60 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-greenMain focus:outline-none focus:ring-1 focus:ring-greenMain resize-none"
                />
              </div>
              <Button className="w-full py-3 text-sm font-semibold tracking-wide bg-greenMain text-darkBlue hover:bg-greenMain/90 transition rounded-xl">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* 7. Enhanced Professional Call to Action (CTA) */}
      <section className="relative overflow-hidden bg-[#0B132B] border-y border-white/5 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,163,0.05)_0,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to Begin?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
            Join thousands of students who have launched successful careers through our platform. Your future starts here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button className="px-6 py-3 text-sm rounded-full bg-greenMain text-darkBlue font-semibold shadow-lg shadow-greenMain/10">
              Create Your Account →
            </Button>
            <button type="button" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">
              Explore Opportunities
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}