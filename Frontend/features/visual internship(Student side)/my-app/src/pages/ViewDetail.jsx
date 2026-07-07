import { useState } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import Card from "../common/Card";
import Button from "../common/Button";

export default function ViewDetail() {
  // Mock listing dataset for the sidebar layout modeled from image_4b6637.png
  const availableInternships = [
    { id: 1, title: "Software Engineering Intern", company: "TechNova", location: "Phnom Penh", duration: "12 weeks", salary: "$6,500/mo", type: "Remote", initial: "T", color: "bg-purple-600/20 text-purple-400", applicants: 67, rating: "4.8", desc: "Help developers around the world build and deploy faster with TechNova. As a Software Engineering Intern, you will be engaging with our community, writing technical infrastructure, building deployment microservices, and helping shape the engineering efficiency of our core platform." },
    { id: 2, title: "DevRel Intern", company: "TechNova", location: "Remote", duration: "12 weeks", salary: "$5,500/mo", type: "Remote", initial: "T", color: "bg-purple-600/20 text-purple-400", applicants: 34, rating: "4.6", desc: "Bridge the gap between developers and our engineering pipelines. In this role, you will create specialized developer tutorials, interact with open-source contributors, and advocate for optimization adjustments across our ecosystem components." },
    { id: 3, title: "Data Science Intern", company: "TechNova", location: "Phnom Penh", duration: "10 weeks", salary: "$6,800/mo", type: "Hybrid", initial: "T", color: "bg-purple-600/20 text-purple-400", applicants: 42, rating: "4.9", desc: "Work closely with our metrics team to build machine learning models, run deep data analytics operations, and formulate data-driven predictions that shape upcoming product releases." },
    { id: 4, title: "Product Design Intern", company: "TechNova", location: "Phnom Penh", duration: "16 weeks", salary: "$7,200/mo", type: "On-site", initial: "T", color: "bg-purple-600/20 text-purple-400", applicants: 81, rating: "4.7", desc: "Design elegant, high-fidelity dashboard structures and user-flows. You will collaborate directly with cross-functional software engineers and project management stakeholders to craft clean, components-based UI interfaces." },
  ];

  // Active interaction selection state 
  const [selectedJob, setSelectedJob] = useState(availableInternships[0]);

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between selection:bg-greenMain selection:text-darkBlue">
      <div>
        <Navbar />

        {/* Global Page Header Block */}
        <div className="border-b border-white/5 bg-[#0B132B]/40 py-8 backdrop-blur-sm">
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/20 text-2xl font-bold text-purple-400 border border-purple-500/10 shadow-lg shadow-purple-950/20">
              {selectedJob.initial}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">TechNova Enterprise</h1>
              <p className="mt-1 text-sm text-gray-400 max-w-2xl">
                A premier global technology hub focused on cutting-edge software development, cloud orchestration, and digital transformation solutions.
              </p>
            </div>
          </main>
        </div>

        {/* Master-Detail Interactive Content Hub */}
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Open Positions Sidebar List (Takes 4 columns) */}
            <section className="lg:col-span-4 space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
              <div className="pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-greenMain">Open Opportunities</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">{availableInternships.length} roles currently active</p>
              </div>

              {availableInternships.map((job) => {
                const isSelected = selectedJob.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                      isSelected
                        ? "border-greenMain/40 bg-[#111B34] shadow-lg shadow-black/30"
                        : "border-white/5 bg-[#111B34]/40 hover:border-white/10 hover:bg-[#111B34]/80"
                    }`}
                  >
                    {/* Bookmark Indicator Match with image_4b6637.png */}
                    <span className="absolute top-4 right-4 text-xs text-gray-500 hover:text-greenMain transition">🔖</span>

                    <div className="flex items-start gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${job.color}`}>
                        {job.initial}
                      </div>
                      <div className="pr-4">
                        <h3 className="text-sm font-semibold tracking-tight text-white group-hover:text-greenMain transition line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">{job.company}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-1 text-[11px] text-gray-400">
                      <div className="flex items-center gap-1">
                        <span>📍</span> {job.location} <span className="text-white/10 mx-1">|</span> <span>🕒</span> {job.duration}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-greenMain">{job.salary}</span>
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-gray-400 uppercase tracking-wide">
                        {job.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* RIGHT COLUMN: Selected Role Detail View (Takes 8 columns) */}
            <section className="lg:col-span-8">
              <Card className="border border-white/10 bg-[#111B34]/60 p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-black/40">
                
                {/* Meta Job Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold ${selectedJob.color} border border-white/5`}>
                      {selectedJob.initial}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{selectedJob.title}</h2>
                      <p className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
                        {selectedJob.company} <span className="h-1 w-1 rounded-full bg-white/20"></span> {selectedJob.location}
                      </p>
                      <p className="text-xs text-yellow-500 mt-1 flex items-center gap-1">
                        ⭐ <span className="font-semibold text-gray-300">{selectedJob.rating} rating</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Metric Grid System Blocks */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/5 bg-[#070B19]/50 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Type</p>
                    <p className="mt-1 text-sm font-bold text-greenMain">{selectedJob.type}</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-[#070B19]/50 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Duration</p>
                    <p className="mt-1 text-sm font-bold text-white">{selectedJob.duration}</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-[#070B19]/50 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Salary</p>
                    <p className="mt-1 text-sm font-bold text-white">{selectedJob.salary}</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-[#070B19]/50 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Applicants</p>
                    <p className="mt-1 text-sm font-bold text-white">{selectedJob.applicants} applied</p>
                  </div>
                </div>

                {/* About the Role Text Area */}
                <div className="mt-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">About the Role</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400 font-normal">
                    {selectedJob.desc}
                  </p>
                </div>

                {/* Dynamic Core Requirements Bullet Sets */}
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Minimum Requirements</h3>
                  <ul className="mt-3 space-y-2 text-xs text-gray-400 list-disc list-inside">
                    <li>Basic familiarity with Modern Framework architecture (React / NextJS ecosystem).</li>
                    <li>Understanding of responsive design principles using styling configurations like TailwindCSS.</li>
                    <li>Solid communication skills and readiness to collaborate in multi-stage code analysis reviews.</li>
                  </ul>
                </div>

                {/* Primary Interactive CTA Actions Panel */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                  <Button className="flex-1 py-3.5 text-sm font-semibold tracking-wide bg-greenMain text-darkBlue hover:bg-greenMain/90 rounded-xl transition shadow-lg shadow-greenMain/10">
                    Apply Now
                  </Button>
                  <button 
                    type="button" 
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
                    title="Bookmark this position"
                  >
                    🔖
                  </button>
                </div>

              </Card>
            </section>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}