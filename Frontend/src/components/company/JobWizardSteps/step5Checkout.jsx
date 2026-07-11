import React, { useState, useRef } from 'react';
import { isBlank, isValidCardNumber, formatCardNumber, isValidExpiryParts, isValidCVC } from '../../../utils/validators';

const PLANS = [
  { id: 'standard', label: 'Standard Listing', price: 49, desc: 'Basic placement in search results for 30 days.' },
  { id: 'featured', label: 'Featured Listing', price: 129, desc: 'Top placement in search, highlighted card, and email inclusion.' }
];

const CARD_DIGIT_LIMIT = 16;

function getErrors(data) {
  const errors = {};
  if (isBlank(data.cardName)) {
    errors.cardName = 'Cardholder name is required.';
  }

  const cardDigits = (data.cardNumber || '').replace(/\D+/g, '');
  if (cardDigits.length === 0) {
    errors.cardNumber = 'Card number is required.';
  } else if (!isValidCardNumber(data.cardNumber)) {
    errors.cardNumber = 'Enter a valid card number.';
  }

  if (isBlank(data.expiryMonth) || isBlank(data.expiryYear)) {
    errors.expiry = 'Expiry date is required.';
  } else if (!isValidExpiryParts(data.expiryMonth, data.expiryYear)) {
    errors.expiry = 'Enter a valid, non-expired MM / YY date.';
  }

  if (isBlank(data.cvc)) {
    errors.cvc = 'CVC is required.';
  } else if (!isValidCVC(data.cvc)) {
    errors.cvc = 'CVC must be 3-4 digits.';
  }

  return errors;
}

export default function Step5Checkout({ data, onChange, onSubmit, onBack, loading, error, showToast }) {
  const [touched, setTouched] = useState({});
  const yearInputRef = useRef(null);
  const monthInputRef = useRef(null);
  const selectedPlan = PLANS.find((p) => p.id === data.plan) || PLANS[1];
  const errors = getErrors(data);
  const isValid = Object.keys(errors).length === 0;

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = () => {
    setTouched({ cardName: true, cardNumber: true, expiry: true, cvc: true });
    if (isValid) onSubmit();
  };

  const errClass = (field) =>
    touched[field] && errors[field]
      ? 'border-rose-500/40 focus:border-rose-500/40'
      : 'border-white/5 focus:border-accent/40';

  // --- Card number: digits only, live "1234-1234-1234-1234" formatting, 16-digit cap ---
  const handleCardNumberChange = (e) => {
    const raw = e.target.value;
    const hadNonDigit = /[^\d\s-]/.test(raw);
    const digitsOnly = raw.replace(/\D+/g, '');

    if (hadNonDigit) {
      showToast('Card number can only contain numbers.');
    }

    if (digitsOnly.length > CARD_DIGIT_LIMIT) {
      showToast(`Card number cannot exceed ${CARD_DIGIT_LIMIT} digits.`);
    }

    const clipped = digitsOnly.slice(0, CARD_DIGIT_LIMIT);
    onChange('cardNumber', formatCardNumber(clipped));
  };

  // --- Expiry: two adjacent 2-digit inputs, digits only, auto-advance ---
  const handleExpiryPart = (part, maxLen, nextRef) => (e) => {
    const raw = e.target.value;
    const hadNonDigit = /\D/.test(raw);
    const digitsOnly = raw.replace(/\D+/g, '');

    if (hadNonDigit) {
      showToast('Expiry date can only contain numbers.');
    }
    if (digitsOnly.length > maxLen) {
      showToast(`Only ${maxLen} digits allowed here.`);
    }

    const clipped = digitsOnly.slice(0, maxLen);
    onChange(part, clipped);

    if (clipped.length === maxLen && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  // When YY is empty and the user presses Backspace again, jump back to MM
  // and delete its last digit — like a normal single "MM/YY" field would.
  const handleExpiryYearKeyDown = (e) => {
    if (e.key === 'Backspace' && data.expiryYear === '') {
      e.preventDefault();
      onChange('expiryMonth', data.expiryMonth.slice(0, -1));
      monthInputRef.current?.focus();
    }
  };

  // --- CVC: digits only, 4-digit cap ---
  const handleCvcChange = (e) => {
    const raw = e.target.value;
    const hadNonDigit = /\D/.test(raw);
    const digitsOnly = raw.replace(/\D+/g, '');

    if (hadNonDigit) {
      showToast('CVC can only contain numbers.');
    }
    if (digitsOnly.length > 4) {
      showToast('CVC cannot exceed 4 digits.');
    }

    onChange('cvc', digitsOnly.slice(0, 4));
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-white/5 bg-[#111B34]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">


      <div className="text-center pb-6 border-b border-white/5 mb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-full">
          Stage 5 of 5
        </span>
        <h2 className="text-2xl font-black text-content mt-3">Finalize Internship Posting</h2>
        <p className="text-xs text-subtle mt-1">Review your details and select a visibility plan before publishing.</p>
      </div>

      <div className="space-y-5">
        {/* Package Recap Summary */}
        <div className="p-4 rounded-xl border border-white/5 bg-surface/50">
          <span className="font-bold text-subtle text-xs">INTERNSHIP SUMMARY</span>
          <p className="text-sm font-bold text-content mt-1.5">{data.title || 'Untitled Internship'}</p>
          <p className="text-xs text-subtle mt-0.5">
            {data.workEnvironment || '—'} • {data.durationValue ? `${data.durationValue} ${data.durationUnit}` : '—'} • {data.payMin && data.payMax ? `$${data.payMin}-$${data.payMax}/mo` : '—'}
          </p>
        </div>

        {/* Plan Select */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-subtle mb-2">Visibility Plan</label>
          <div className="grid gap-3">
            {PLANS.map((plan) => {
              const isSelected = data.plan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => onChange('plan', plan.id)}
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    isSelected
                      ? 'border-accent/30 bg-[#111B34]/60 shadow-md shadow-accent/10'
                      : 'border-white/5 bg-surface/20 hover:border-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    checked={isSelected}
                    onChange={() => onChange('plan', plan.id)}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="flex-1">
                    <div className={`flex items-center justify-between text-xs font-bold ${isSelected ? 'text-accent' : 'text-content'}`}>
                      <span>{plan.label}{plan.id === 'featured' && ' (Recommended)'}</span>
                      <span>${plan.price}</span>
                    </div>
                    <p className="text-[11px] text-subtle mt-0.5">{plan.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t border-white/5 pt-4 space-y-3.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-subtle">Payment Details</label>

          <div>
            <input
              type="text"
              value={data.cardName}
              onChange={(e) => onChange('cardName', e.target.value)}
              onBlur={() => markTouched('cardName')}
              placeholder="Cardholder Name"
              className={`w-full px-4 py-2.5 rounded-xl border bg-surface/60 text-xs text-content focus:outline-none transition ${errClass('cardName')}`}
            />
            {touched.cardName && errors.cardName && <p className="text-[10px] text-rose-400 mt-1 font-medium">{errors.cardName}</p>}
          </div>

          <div>
            <input
              type="text"
              inputMode="numeric"
              value={data.cardNumber}
              onChange={handleCardNumberChange}
              onBlur={() => markTouched('cardNumber')}
              placeholder="1234-1234-1234-1234"
              maxLength={19}
              className={`w-full px-4 py-2.5 rounded-xl border bg-surface/60 text-xs text-content tracking-wider focus:outline-none transition ${errClass('cardNumber')}`}
            />
            {touched.cardNumber && errors.cardNumber && <p className="text-[10px] text-rose-400 mt-1 font-medium">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border bg-surface/60 focus-within:border-accent/40 transition ${errClass('expiry')}`}>
                <input
                  ref={monthInputRef}
                  type="text"
                  inputMode="numeric"
                  value={data.expiryMonth}
                  onChange={handleExpiryPart('expiryMonth', 2, yearInputRef)}
                  onBlur={() => markTouched('expiry')}
                  placeholder="MM"
                  maxLength={2}
                  className="w-6 bg-transparent text-xs text-content text-center focus:outline-none"
                />
                <span className="text-subtle text-xs">/</span>
                <input
                  ref={yearInputRef}
                  type="text"
                  inputMode="numeric"
                  value={data.expiryYear}
                  onChange={handleExpiryPart('expiryYear', 2, null)}
                  onKeyDown={handleExpiryYearKeyDown}
                  onBlur={() => markTouched('expiry')}
                  placeholder="YY"
                  maxLength={2}
                  className="w-6 bg-transparent text-xs text-content text-center focus:outline-none"
                />
              </div>
              {touched.expiry && errors.expiry && <p className="text-[10px] text-rose-400 mt-1 font-medium">{errors.expiry}</p>}
            </div>
            <div>
              <input
                type="text"
                inputMode="numeric"
                value={data.cvc}
                onChange={handleCvcChange}
                onBlur={() => markTouched('cvc')}
                placeholder="CVC"
                maxLength={4}
                className={`w-full px-4 py-2.5 rounded-xl border bg-surface/60 text-xs text-content focus:outline-none transition text-center ${errClass('cvc')}`}
              />
              {touched.cvc && errors.cvc && <p className="text-[10px] text-rose-400 mt-1 font-medium">{errors.cvc}</p>}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        )}

        {/* Totals + Actions */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-subtle uppercase tracking-wider block">Total Due</span>
            <span className="text-2xl font-black text-accent">${selectedPlan.price}.00</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onBack} disabled={loading} className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-subtle hover:bg-raised/5 transition disabled:opacity-40">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-accent text-[#070B19] hover:bg-accent transition shadow-lg shadow-accent/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : 'Publish Internship'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}