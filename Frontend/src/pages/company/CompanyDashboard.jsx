import React, { useState } from 'react';
import CompanyNavbar from '../../components/layout/CompanyNavbar';
import CompanyFooter from '../../components/layout/CompanyFooter';
import PostedJobsList from '../../components/company/Dashboard/postedjobsList';
import SelectedJobView from '../../components/company/Dashboard/SelectedJobView';

export default function CompanyDashboard() {
  // Mock data representing the exact listings layout from image_ea3a04.png
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Junior UX Researcher",
      location: "San Francisco, CA",
      type: "Remote / Hybrid",
      applicantsCount: 47,
      status: "Active",
      description: "Seeking an inquisitive researcher to help shape our next-gen product facets through generative and evaluative studies.",
      postedDate: "June 12, 2026",
      salary: "$4.5k - $6k/mo",
      applicants: [
        { id: 101, name: "Clara Sterling", role: "UX Research Intern", matchScore: "96% Match", university: "Stanford Uni", avatar: "CS" },
        { id: 102, name: "Marcus Thorne", role: "Product Design Grad", matchScore: "91% Match", university: "UC Berkeley", avatar: "MT" }
      ]
    },
    {
      id: 2,
      title: "Software Engineer Intern",
      location: "New York, NY",
      type: "On-site",
      applicantsCount: 124,
      status: "Active",
      description: "Join our core infrastructure engineering crew to scale web services and optimize database transactional pipelines.",
      postedDate: "June 10, 2026",
      salary: "$6k - $7.5k/mo",
      applicants: [
        { id: 201, name: "Alex Mercer", role: "Backend Enthusiast", matchScore: "94% Match", university: "MIT", avatar: "AM" }
      ]
    },
    {
      id: 3,
      title: "Data Science Intern",
      location: "Remote",
      type: "Full-time",
      applicantsCount: 18,
      status: "Frozen",
      description: "Build predictive models and structure deep analytics pipelines directly supporting leadership strategic steps.",
      postedDate: "May 28, 2026",
      salary: "$5.5k - $7k/mo",
      applicants: []
    }
  ]);

  const [selectedJobId, setSelectedJobId] = useState(1);
  const activeJob = jobs.find(job => job.id === selectedJobId) || jobs[0];

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-[#070B19]">
      <CompanyNavbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Component Workspace Wrapper */}
          <div className="lg:col-span-4">
            <PostedJobsList 
              jobs={jobs} 
              selectedJobId={selectedJobId} 
              onSelectJob={setSelectedJobId} 
            />
          </div>

          {/* Right Column Component Workspace Wrapper */}
          <div className="lg:col-span-8">
            <SelectedJobView job={activeJob} />
          </div>

        </div>
      </main>

      <CompanyFooter />
    </div>
  );
}
