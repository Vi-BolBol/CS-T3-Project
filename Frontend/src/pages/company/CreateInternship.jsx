import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from '../../components/layout/CompanyNavbar';
import CompanyFooter from '../../components/layout/CompanyFooter';
import useCompanyJobs from '../../hooks/useCompanyJobs';
import useToast from '../../hooks/useToast';
import Toast from '../../components/shared/Toast';
import Step1Essential from '../../components/company/JobWizardSteps/step1Essential';
import Step2Detail from '../../components/company/JobWizardSteps/step2Detail';
import Step3Compensation from '../../components/company/JobWizardSteps/step3Compensation';
import Step4Review from '../../components/company/JobWizardSteps/step4Review';
import Step5Checkout from '../../components/company/JobWizardSteps/step5Checkout';
import WizardProgress from '../../components/company/JobWizardSteps/WizardProgress';

const INITIAL_DATA = {
  // Step 1 — Job Essentials
  title: '',
  department: '',
  workEnvironment: 'Hybrid',
  description: '',
  location: '',
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
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const { publishNewJob, loading, error } = useCompanyJobs();
  const { message: toastMessage, showToast, clearToast } = useToast();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goNext = () => setStep((s) => Math.min(s + 1, 5));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));
  const cancelWizard = () => navigate('/company/dashboard');

  const handlePublish = async () => {
    const result = await publishNewJob(formData);
    if (result.success) {
      navigate('/company/dashboard');
    } else {
      showToast(result.message || 'Failed to publish internship. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface text-content selection:bg-accent selection:text-[#070B19] flex flex-col justify-between">
      <CompanyNavbar />

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

      <CompanyFooter />
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  );
}
