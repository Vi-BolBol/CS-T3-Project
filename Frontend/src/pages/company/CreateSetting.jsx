import React from 'react';
import CompanyNavbar from '../../components/layout/CompanyNavbar';
import CompanyFooter from '../../components/layout/CompanyFooter';
import FormCard from '../../components/company/ui/FormCard';
import FormInput from '../../components/company/ui/FormInput';
import FormButton from '../../components/company/ui/FormButton';

export default function CreateSetting() {
  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between">
      <CompanyNavbar />

      <main className="flex-1 mx-auto w-full max-w-xl px-4 py-16 flex flex-col justify-center">
        <FormCard glow className="border border-white/10">
          <div className="text-center pb-4 border-b border-white/5 mb-6">
            <h2 className="text-xl font-black tracking-tight text-white">Initialize Corporate Workspace</h2>
            <p className="text-xs text-gray-400 mt-1">Configure your foundational configuration matrix to unlock onboarding candidate searches.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Workspace settings generated successfully!"); }}>
            <FormInput label="Workspace Unique Domain Identifier" placeholder="e.g. nexusgenesis" />
            <FormInput label="Primary Access Routing Webhook" placeholder="https://api.yourbrand.com/v1" type="url" />
            
            <div className="pt-4 flex items-center justify-end gap-2">
              <FormButton variant="secondary" type="button" onClick={() => window.history.back()}>
                Cancel
              </FormButton>
              <FormButton variant="primary" type="submit">
                Provisions Architecture
              </FormButton>
            </div>
          </form>
        </FormCard>
      </main>

      <CompanyFooter />
    </div>
  );
}
