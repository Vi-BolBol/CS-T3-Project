import React, { useState } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import SidebarNav from '../company/Settings/SidebarNav';
import PersonalDataForm from '../company/Settings/PersonalDataForm';

export default function CompanySetting() {
  const [activeTab, setActiveTab] = useState('Personal Data');

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3">
            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="lg:col-span-9 rounded-2xl border border-white/5 bg-[#111B34]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {activeTab === 'Personal Data' ? (
              <PersonalDataForm />
            ) : (
              <div className="py-12 text-center text-xs text-gray-500 border border-dashed border-white/5 rounded-xl">
                {activeTab} workspace module is ready for connection hooks.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
