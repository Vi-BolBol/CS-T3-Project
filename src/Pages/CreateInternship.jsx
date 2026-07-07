import React, { useState } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import useCompanyJobs from '../hooks/useCompanyJobs';
import useToast from '../hooks/useToast';
import Toast from '../components/Toast';
import Step1Essential from '../company/JobWizardSteps/step1Essential';
import Step2Detail from '../company/JobWizardSteps/step2Detail';
import Step3Compensation from '../company/JobWizardSteps/step3Compensation';
import Step4Review from '../company/JobWizardSteps/step4Review';
import Step5Checkout from '../company/JobWizardSteps/step5Checkout';
import WizardProgress from '../company/JobWizardSteps/WizardProgress';

const INITIAL_DATA = {
  // Step 1 — Job Essentials
  title: '',
  department: '',
  workEnvironment: 'Hybrid',
  description: '',
  // Step 2 — Role Details (tags)
  skills: [],
  responsibilities: [],
  // Step 3 — Compensation
  payMin: '',
  payMax: '',
  durationValue: '',
  durationUnit: 'Months',
  // Step 5 — Checkout
  plan: 'featured',
  cardName: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvc: ''
};

export default function CreateInternship() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const { publishNewJob, loading, error } = useCompanyJobs();
  const { message: toastMessage, showToast, clearToast } = useToast();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goNext = () => setStep((s) => Math.min(s + 1, 5));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));
  const cancelWizard = () => { window.location.href = '/company-dashboard'; };

  const handlePublish = async () => {
    const result = await publishNewJob(formData);
    if (result.success) {
      window.location.href = '/company-dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-white selection:bg-emerald-500 selection:text-[#070B19]">
      <Header />

      <main className="min-h-screen w-full flex flex-col px-4 pt-4 pb-12 sm:px-6 lg:px-8">
        <WizardProgress currentStep={step} />

        <div className="flex-1 flex flex-col items-center justify-center">
          {step === 1 && (
            <Step1Essential data={formData} onChange={updateField} onNext={goNext} onCancel={cancelWizard} />
          )}
          {step === 2 && (
            <Step2Detail data={formData} onChange={updateField} onNext={goNext} onBack={goBack} />
          )}
          {step === 3 && (
            <Step3Compensation data={formData} onChange={updateField} onNext={goNext} onBack={goBack} />
          )}
          {step === 4 && (
            <Step4Review data={formData} onNext={goNext} onBack={goBack} />
          )}
          {step === 5 && (
            <Step5Checkout
              data={formData}
              onChange={updateField}
              onSubmit={handlePublish}
              onBack={goBack}
              loading={loading}
              error={error}
              showToast={showToast}
            />
          )}
        </div>
      </main>

      <Footer />
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  );
}