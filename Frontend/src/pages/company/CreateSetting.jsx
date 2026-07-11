import React from 'react';
import CompanyNavbar from '../../components/layout/CompanyNavbar';
import CompanyFooter from '../../components/layout/CompanyFooter';
import Card from '../../components/company/ui/Card';
import Input from '../../components/company/ui/Input';
import Button from '../../components/company/ui/Button';

export default function CreateSetting() {
  return (
    <div className="min-h-screen bg-surface text-content flex flex-col justify-between">
      <CompanyNavbar />

      <main className="flex-1 mx-auto w-full max-w-xl px-4 py-16 flex flex-col justify-center">
        <Card glow className="border border-white/10">
          <div className="text-center pb-4 border-b border-white/5 mb-6">
            <h2 className="text-xl font-black tracking-tight text-content">Initialize Corporate Workspace</h2>
            <p className="text-xs text-subtle mt-1">Configure your foundational configuration matrix to unlock onboarding candidate searches.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Workspace settings generated successfully!"); }}>
            <Input label="Workspace Unique Domain Identifier" placeholder="e.g. nexusgenesis" />
            <Input label="Primary Access Routing Webhook" placeholder="https://api.yourbrand.com/v1" type="url" />
            
            <div className="pt-4 flex items-center justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Provisions Architecture
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <CompanyFooter />
    </div>
  );
}
