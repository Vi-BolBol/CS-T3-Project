import React, { useState } from 'react';
import { isBlank } from '../../../utils/validators';

const DURATION_UNITS = ['Weeks', 'Months', 'Years'];

function getErrors(data) {
  const errors = {};
  if (isBlank(data.payMin)) {
    errors.payMin = 'Minimum pay is required.';
  } else if (isNaN(Number(data.payMin)) || Number(data.payMin) < 0) {
    errors.payMin = 'Enter a valid amount.';
  }

  if (isBlank(data.payMax)) {
    errors.payMax = 'Maximum pay is required.';
  } else if (isNaN(Number(data.payMax)) || Number(data.payMax) < 0) {
    errors.payMax = 'Enter a valid amount.';
  }

  if (!errors.payMin && !errors.payMax && Number(data.payMax) < Number(data.payMin)) {
    errors.payMax = 'Maximum must be greater than or equal to minimum.';
  }

  if (isBlank(data.durationValue)) {
    errors.durationValue = 'Duration is required.';
  } else if (isNaN(Number(data.durationValue)) || Number(data.durationValue) <= 0) {
    errors.durationValue = 'Enter a valid duration.';
  }

  return errors;
}

export default function Step3Compensation({ data, onChange, onNext, onBack }) {
  const [touched, setTouched] = useState({});
  const errors = getErrors(data);
  const isValid = Object.keys(errors).length === 0;

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleNext = () => {
    setTouched({ payMin: true, payMax: true, durationValue: true });
    if (isValid) onNext();
  };

  const handleNumericChange = (field, value) => {
    // Digits only (allow empty while typing)
    if (value === '' || /^\d+$/.test(value)) {
      onChange(field, value);
    }
  };

  const errClass = (field) =>
    touched[field] && errors[field]
      ? 'border-rose-500/40 focus:border-rose-500/40'
      : 'border-white/5 focus:border-accent/40';

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-white/5 bg-[#111B34]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">

      <div className="mb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-full">
          Stage 3 of 5
        </span>
        <h2 className="text-xl font-bold tracking-tight text-content mt-4">Compensation</h2>
        <p className="text-xs text-subtle mt-1">Set monthly pay range and internship duration.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-subtle mb-2">Monthly Pay Range</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle text-sm">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={data.payMin}
                  onChange={(e) => handleNumericChange('payMin', e.target.value)}
                  onBlur={() => markTouched('payMin')}
                  placeholder="Min (e.g. 4000)"
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border bg-surface/60 text-sm text-content placeholder-gray-600 focus:outline-none transition ${errClass('payMin')}`}
                />
              </div>
              {touched.payMin && errors.payMin && <p className="text-[10px] text-rose-400 mt-1.5 font-medium">{errors.payMin}</p>}
            </div>
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle text-sm">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={data.payMax}
                  onChange={(e) => handleNumericChange('payMax', e.target.value)}
                  onBlur={() => markTouched('payMax')}
                  placeholder="Max (e.g. 6000)"
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border bg-surface/60 text-sm text-content placeholder-gray-600 focus:outline-none transition ${errClass('payMax')}`}
                />
              </div>
              {touched.payMax && errors.payMax && <p className="text-[10px] text-rose-400 mt-1.5 font-medium">{errors.payMax}</p>}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-subtle mb-2">Duration</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                inputMode="numeric"
                value={data.durationValue}
                onChange={(e) => handleNumericChange('durationValue', e.target.value)}
                onBlur={() => markTouched('durationValue')}
                placeholder="e.g. 3"
                className={`w-full px-4 py-3 rounded-xl border bg-surface/60 text-sm text-content placeholder-gray-600 focus:outline-none transition ${errClass('durationValue')}`}
              />
              {touched.durationValue && errors.durationValue && <p className="text-[10px] text-rose-400 mt-1.5 font-medium">{errors.durationValue}</p>}
            </div>
            <select
              value={data.durationUnit}
              onChange={(e) => onChange('durationUnit', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/5 bg-surface/60 text-sm text-subtle focus:outline-none focus:border-accent/40 transition"
            >
              {DURATION_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-subtle hover:text-content hover:bg-raised/5 transition">Back</button>
        <button onClick={handleNext} className="px-6 py-2.5 rounded-xl text-xs font-bold bg-accent text-[#070B19] hover:bg-accent transition shadow-lg shadow-accent/10">Next Step</button>
      </div>
    </div>
  );
}