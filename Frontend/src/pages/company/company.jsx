import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useParams, Link } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function Company() {
  // Enhanced dataset to support interactive filtering features
  const initialCompanies = [
    { name: "TechNova", jobs: 12, location: "Phnom Penh", industry: "Frontend Development", type: "Hybrid", initial: "T", color: "bg-accent-soft/20 text-accent" },
    { name: "RMA", jobs: 8, location: "Phnom Penh", industry: "Software Engineering", type: "Remote", initial: "R", color: "bg-accent/20 text-greenMain" },
    { name: "AMK Bank", jobs: 5, location: "Phnom Penh", industry: "WebDesign", type: "Full-time", initial: "AMK", color: "bg-blue-600/20 text-blue-400" },
    { name: "Smart", jobs: 14, location: "sales", industry: "Design Tools", type: "Remote", initial: "S", color: "bg-pink-600/20 text-pink-400" },
    { name: "ABA Bank", jobs: 9, location: "Phnom Penh", industry: "Productivity", type: "Hybrid", initial: "ABA", color: "bg-yellow-600/20 text-yellow-500" },
    { name: "MekongBank", jobs: 22, location: "Phnom Penh", industry: "Sales", type: "Full-time", initial: "MK", color: "bg-indigo-600/20 text-indigo-400" },
  ];

  // Component State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Filtering Logic
  const filteredCompanies = initialCompanies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeFilter === "All" || company.type === activeFilter;
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-surface text-content flex flex-col justify-between">
      <div>
        <Header />

        <main className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
          
          {/* Section Heading & Subtext */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore Partnerships</h1>
            <p className="mt-2 text-sm text-subtle sm:text-base">
              Discover top-tier companies offering world-class virtual and on-site internship opportunities.
            </p>
          </div>

          {/* Search Bar Block - Directly styled from your UI layout reference */}
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-xl relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search by company name or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-line bg-[#111B34] pl-11 pr-4 py-3 text-sm text-content placeholder-gray-500 focus:border-greenMain focus:outline-none focus:ring-1 focus:ring-greenMain transition"
              />
            </div>
          </div>

          {/* Filtering Control Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-2 border-b border-line pb-4 text-xs font-medium">
            {["All", "Remote", "Hybrid", "Full-time"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`rounded-full px-4 py-2 transition ${
                  activeFilter === tab
                    ? "bg-greenMain text-darkBlue font-semibold"
                    : "bg-raised/5 text-subtle hover:bg-raised/10 hover:text-content"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dynamic Counters */}
          <div className="mt-6 flex items-center justify-between text-xs text-subtle">
            <p>Showing {filteredCompanies.length} companies</p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="text-greenMain hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Grid Layout Container */}
          {filteredCompanies.length > 0 ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {filteredCompanies.map((company) => (
                <Card key={company.name} className="relative flex flex-col justify-between border border-line bg-[#111B34] p-6 transition-all hover:border-greenMain/30 hover:shadow-xl hover:shadow-black/20 rounded-[1.5rem]">
                  
                  {/* Card Header Info */}
                  <div>
                    <div className="flex items-start justify-between">
                      {/* Styled Dynamic Branding Circle */}
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${company.color}`}>
                        {company.initial}
                      </div>
                      {/* Operational Model Tag */}
                      <span className="rounded-full bg-raised/5 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-greenMain uppercase">
                        {company.type}
                      </span>
                    </div>

                    {/* Metadata Content */}
                    <div className="mt-4">
                      <h2 className="text-xl font-semibold tracking-tight">{company.name}</h2>
                      <p className="inline-block mt-0.5 rounded bg-raised/5 px-2 py-0.5 text-[11px] font-medium text-subtle">
                        {company.industry}
                      </p>
                    </div>

                    {/* Geographic Metrics */}
                    <div className="mt-4 space-y-1.5 text-xs text-subtle">
                      <div className="flex items-center gap-1.5">
                        <span>📍</span> {company.location}
                      </div>
                    </div>
                  </div>

                  {/* Operational Footer Details */}
                  <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-subtle uppercase tracking-wider">Availability</p>
                      <p className="text-sm font-semibold text-greenMain">{company.jobs} positions</p>
                    </div>
                    <Link to={`/company/${company.name.toLowerCase()}`} className="text-greenMain hover:underline text-sm font-medium">
                      View Details
                    </Link>
                  </div>

                </Card>
              ))}
            </div>
          ) : (
            /* Empty Search Fallback State */
            <div className="mt-12 text-center py-12 rounded-[2rem] border border-dashed border-line bg-raised/5">
              <span className="text-3xl">📁</span>
              <h3 className="mt-2 text-base font-semibold text-content">No results found</h3>
              <p className="mt-1 text-sm text-subtle">Try checking your spelling or selecting a different filter.</p>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}