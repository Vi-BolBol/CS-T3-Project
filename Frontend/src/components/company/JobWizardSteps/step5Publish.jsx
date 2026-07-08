import React, { useState, useEffect, useRef } from 'react';
import { isBlank, isValidCardNumber, formatCardNumber, isValidExpiryParts, isValidCVC } from '../../../utils/validators';

const PLANS = [
  { id: 'standard', label: 'Standard Listing', tag: '$9', price: 9, desc: 'Basic placement in search results for 30 days.' },
  { id: 'featured', label: 'Featured Listing', tag: '$29', price: 29, desc: 'Top placement in search, highlighted card, and email inclusion.' }
];

// Simulates a short publish/processing step so the final stage doesn't
// just feel like an instant form submit, after payment is validated.
const PUBLISH_DURATION_MS = 1600;

export default function Step5Publish({ data, onChange, onSubmit, onBack, loading, error }) {
  const [publishing, setPublishing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [card, setCard] = useState({ holder: '', number: '', month: '', year: '', cvc: '' });
  const [touched, setTouched] = useState({});
  const timerRef = useRef(null);

  const selectedPlan = PLANS.find((p) => p.id === data.plan) || PLANS[1];

  const cardErrors = {
    holder: isBlank(card.holder) ? 'Cardholder name is required.' : '',
    number: !isValidCardNumber(card.number) ? 'Enter a valid card number.' : '',
    expiry: !isValidExpiryParts(card.month, card.year) ? 'Enter a valid, non-expired MM/YY.' : '',
    cvc: !isValidCVC(card.cvc) ? 'Enter a valid CVC.' : ''
  };
  const isCardValid = Object.values(cardErrors).every((v) => !v);

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const updateCard = (field, value) => setCard((c) => ({ ...c, [field]: value }));

  const handleCardNumberChange = (e) => {
    const digits = e.target.value.replace(/\D+/g, '').slice(0, 19);
    updateCard('number', formatCardNumber(digits));
  };

  const handleExpiryChange = (e) => {
    const digits = e.target.value.replace(/\D+/g, '').slice(0, 4);
    const month = digits.slice(0, 2);
    const year = digits.slice(2, 4);
    updateCard('month', month);
    updateCard('year', year);
  };

  const expiryDisplay = `${card.month}${card.year ? '/' + card.year : ''}`;

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handlePublishClick = () => {
    if (publishing || loading) return;

    if (!isCardValid) {
      setTouched({ holder: true, number: true, expiry: true, cvc: true });
      return;
    }

    setPublishing(true);
    setProgress(0);

    const stepMs = 80;
    const totalSteps = PUBLISH_DURATION_MS / stepMs;
    let currentStep = 0;

    timerRef.current = setInterval(() => {
      currentStep += 1;
      setProgress(Math.min(100, Math.round((currentStep / totalSteps) * 100)));

      if (currentStep >= totalSteps) {
        clearInterval(timerRef.current);
        onSubmit();
      }
    }, stepMs);
  };

  // If the actual submission fails, stop the "publishing" UI so the person
  // can see the error and retry instead of staring at a stuck progress bar.
  useEffect(() => {
    if (error) {
      clearInterval(timerRef.current);
      setPublishing(false);
      setProgress(0);
    }
  }, [error]);

  const isBusy = publishing || loading;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-white/5 bg-[#111B34]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">

      <div className="text-center pb-6 border-b border-white/5 mb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
          Stage 5 of 5
        </span>
        <h2 className="text-2xl font-black text-white mt-3">Review &amp; Publish</h2>
        <p className="text-xs text-gray-400 mt-1">Choose a plan and complete payment to publish your listing.</p>
      </div>

      <div className="space-y-5">
        {/* Package Recap Summary */}
        <div className="p-4 rounded-xl border border-white/5 bg-[#070B19]/50">
          <span className="font-bold text-gray-300 text-xs">INTERNSHIP SUMMARY</span>
          <p className="text-sm font-bold text-white mt-1.5">{data.title || 'Untitled Internship'}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {data.location || 'Location not specified'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {data.workEnvironment || '—'} • {data.durationValue ? `${data.durationValue} ${data.durationUnit}` : '—'} • {data.payMin && data.payMax ? `$${data.payMin}-$${data.payMax}/mo` : '—'}
          </p>
        </div>

        {/* Plan Select */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Visibility Plan</label>
          <div className="grid gap-3">
            {PLANS.map((plan) => {
              const isSelected = data.plan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => !isBusy && onChange('plan', plan.id)}
                  className={`p-4 rounded-xl border flex items-start gap-3 transition ${isBusy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${
                    isSelected
                      ? 'border-emerald-500/30 bg-[#111B34]/60 shadow-md shadow-emerald-950/10'
                      : 'border-white/5 bg-[#070B19]/20 hover:border-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    checked={isSelected}
                    disabled={isBusy}
                    onChange={() => onChange('plan', plan.id)}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="flex-1">
                    <div className={`flex items-center justify-between text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                      <span>{plan.label}</span>
                      <span className="text-[10px] uppercase tracking-wide text-gray-400">{plan.tag}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{plan.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Payment Details</label>
            <span className="text-[10px] text-gray-400">Total: <span className="text-emerald-400 font-bold">${selectedPlan.price}.00</span></span>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-[#070B19]/50 space-y-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Card Holder Name</label>
              <input
                type="text"
                value={card.holder}
                disabled={isBusy}
                onChange={(e) => updateCard('holder', e.target.value)}
                onBlur={() => markTouched('holder')}
                placeholder="e.g. Sok Bunthoeun"
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-[#111B34]/60 text-sm text-white placeholder-gray-600 focus:outline-none transition disabled:opacity-50 ${
                  touched.holder && cardErrors.holder ? 'border-rose-500/40' : 'border-white/5 focus:border-emerald-500/40'
                }`}
              />
              {touched.holder && cardErrors.holder && <p className="text-[10px] text-rose-400 mt-1 font-medium">{cardErrors.holder}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Card Number</label>
              <input
                type="text"
                inputMode="numeric"
                value={card.number}
                disabled={isBusy}
                onChange={handleCardNumberChange}
                onBlur={() => markTouched('number')}
                placeholder="1234-1234-1234-1234"
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-[#111B34]/60 text-sm text-white placeholder-gray-600 focus:outline-none transition tracking-wider disabled:opacity-50 ${
                  touched.number && cardErrors.number ? 'border-rose-500/40' : 'border-white/5 focus:border-emerald-500/40'
                }`}
              />
              {touched.number && cardErrors.number && <p className="text-[10px] text-rose-400 mt-1 font-medium">{cardErrors.number}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">MM/YY</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiryDisplay}
                  disabled={isBusy}
                  onChange={handleExpiryChange}
                  onBlur={() => markTouched('expiry')}
                  placeholder="MM/YY"
                  className={`w-full px-3.5 py-2.5 rounded-lg border bg-[#111B34]/60 text-sm text-white placeholder-gray-600 focus:outline-none transition disabled:opacity-50 ${
                    touched.expiry && cardErrors.expiry ? 'border-rose-500/40' : 'border-white/5 focus:border-emerald-500/40'
                  }`}
                />
                {touched.expiry && cardErrors.expiry && <p className="text-[10px] text-rose-400 mt-1 font-medium">{cardErrors.expiry}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">CVC</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={card.cvc}
                  disabled={isBusy}
                  onChange={(e) => updateCard('cvc', e.target.value.replace(/\D+/g, '').slice(0, 4))}
                  onBlur={() => markTouched('cvc')}
                  placeholder="123"
                  className={`w-full px-3.5 py-2.5 rounded-lg border bg-[#111B34]/60 text-sm text-white placeholder-gray-600 focus:outline-none transition disabled:opacity-50 ${
                    touched.cvc && cardErrors.cvc ? 'border-rose-500/40' : 'border-white/5 focus:border-emerald-500/40'
                  }`}
                />
                {touched.cvc && cardErrors.cvc && <p className="text-[10px] text-rose-400 mt-1 font-medium">{cardErrors.cvc}</p>}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        )}

        {/* Publishing progress */}
        {isBusy && (
          <div className="pt-1">
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-75 ease-linear"
                style={{ width: `${loading ? 100 : progress}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2 text-center">Publishing your listing…</p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
          <button onClick={onBack} disabled={isBusy} className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:bg-white/5 transition disabled:opacity-40">
            Back
          </button>
          <button
            onClick={handlePublishClick}
            disabled={isBusy}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-[#070B19] hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isBusy ? 'Publishing...' : 'Publish Internship'}
          </button>
        </div>

      </div>
    </div>
  );
}
