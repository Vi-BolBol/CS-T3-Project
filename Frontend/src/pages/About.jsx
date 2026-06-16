import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import Card from "../components/common/Card.jsx";

export default function About() {
  return (
    <div className="min-h-screen bg-[#070B19] text-white selection:bg-greenMain selection:text-darkBlue">
      <Header />

      {/* Hero Header Section */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8 sm:px-8 text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-greenMain">
          Our Story
        </span>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          About <span className="text-greenMain">Fast Internship</span>
        </h1>
      </section>

      {/* Main Content Sections */}
      <main className="mx-auto max-w-6xl px-6 sm:px-8 pb-24">
        
        {/* Two-Column Company Overview */}
        <div className="grid gap-8 border-y border-white/5 py-12 md:grid-cols-3 md:items-start">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Bridging the Gap Between Ambition and Career Opportunities
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">
              Fast Internship empowers ambitious students and fresh graduates by completely 
              streamlining the journey from academic learning to corporate integration. We serve 
              as a decentralized gateway where emerging talent can discover top-tier virtual 
              and physical environments, build robust professional resumes, and optimize application pipelines.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#111B34]/60 p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-greenMain">Quick Metrics</p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide">Vetted Organizations</p>
              </div>
              <div className="border-t border-white/5 pt-3">
                <p className="text-2xl font-black text-greenMain">Cambodia</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide">Primary Talent Hub</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars (Mission, Vision, Goal) */}
        <section className="mt-16">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-white">Foundational Pillars</h2>
            <p className="mt-1 text-xs text-gray-400">The driving principles behind our ecosystem</p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border border-white/5 bg-[#111B34]/40 p-6 rounded-2xl hover:border-greenMain/30 transition-all duration-300">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-greenMain/10 text-lg text-greenMain">
                🎯
              </div>
              <h3 className="text-lg font-bold tracking-tight text-white">Our Mission</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                To eliminate professional barriers, providing structured pipelines that help students 
                secure matching corporate internships and entry-level tracks efficiently.
              </p>
            </Card>

            <Card className="border border-white/5 bg-[#111B34]/40 p-6 rounded-2xl hover:border-greenMain/30 transition-all duration-300">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-greenMain/10 text-lg text-greenMain">
                👁️
              </div>
              <h3 className="text-lg font-bold tracking-tight text-white">Our Vision</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                To scale as Cambodia’s definitive digital platform for career exploration, setting high 
                industry standards for recruitment integrity and skills acceleration.
              </p>
            </Card>

            <Card className="border border-white/5 bg-[#111B34]/40 p-6 rounded-2xl hover:border-greenMain/30 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-greenMain/10 text-lg text-greenMain">
                🏁
              </div>
              <h3 className="text-lg font-bold tracking-tight text-white">Our Goal</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                To connect matching skill arrays with elite modern operations, drastically reducing 
                onboarding frictions for both candidate pools and enterprise partners.
              </p>
            </Card>
          </div>
        </section>

        {/* Professional Team Section */}
        <section className="mt-20">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-white">Our Team</h2>
            <p className="mt-1 text-xs text-gray-400">The minds constructing the future of local internship hunting</p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Vibol", role: "Database Administrator", initials: "VB" },
              { name: "rathanak", role: "backend developer", initials: "RN" },
              { name: "lovKimtech", role: "full-stack developer", initials: "LK" },
           
            ].map((member, index) => (
              <div 
                key={index} 
                className="group rounded-2xl border border-white/5 bg-[#111B34]/30 p-5 text-center transition hover:border-white/10"
              >
                {/* Logo / Profile Circle Mirroring Image_4bde38 Asset Structure */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-greenMain/10 text-sm font-bold tracking-wider text-greenMain group-hover:scale-105 transition duration-300">
                  {member.initials}
                </div>
                <h4 className="mt-4 text-sm font-semibold tracking-tight text-white">{member.name}</h4>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5">{member.role}</p>
                
                {/* Social Micro Anchor Elements */}
                <div className="mt-4 flex justify-center gap-3 text-xs text-gray-500 group-hover:text-gray-400 transition">
                  <span className="cursor-pointer hover:text-greenMain">🔗 LinkedIn</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}