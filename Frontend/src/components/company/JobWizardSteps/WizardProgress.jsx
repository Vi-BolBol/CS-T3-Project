import React from 'react';

const STEPS = [
  { n: 1, label: 'Job Essentials' },
  { n: 2, label: 'Role Details' },
  { n: 3, label: 'Compensation' },
  { n: 4, label: 'Review' },
  { n: 5, label: 'Finalize' }
];

export default function WizardProgress({ currentStep }) {
  return (
    <div className="w-full px-2 sm:px-8 py-2">
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => {
          const isPast = step.n < currentStep;
          const isCurrent = step.n === currentStep;
          const isActiveOrDone = isPast || isCurrent;

          return (
            <div key={step.n} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    isActiveOrDone
                      ? 'bg-emerald-400 border-emerald-400 text-[#070B19]'
                      : 'bg-transparent border-white/10 text-gray-500'
                  }`}
                >
                  {isPast ? '✓' : step.n}
                </div>
                <span className={`text-[11px] font-medium whitespace-nowrap ${isActiveOrDone ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`h-0.5 w-10 sm:w-20 mx-2 mb-6 transition-all ${isPast ? 'bg-emerald-400' : 'bg-white/10'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}