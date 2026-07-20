import StepProgressBar from '../../components/cv/StepProgressBar.jsx';
import ToggleButtonGroup from '../../components/shared/ToggleButtonGroup.jsx';
import CustomSelect from '../../components/shared/CustomSelect.jsx';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCVBuilder } from '../../context/CVBuilderContext.jsx';
import SuggestionBanner from '../../components/shared/SuggestionBanner.jsx';

function getDaysinMonth(month, year){
  if(!month || !year) return 31
  return new Date(year, month, 0).getDate()
}

function CVStep2Personal() {

  const navigate = useNavigate()
  const { cvData, updatePersonal, markStepComplete } = useCVBuilder()

  const today = new Date()
  const p = cvData.personal

  const cambodianProvinces = [
    'Phnom Penh','Banteay Meanchey','Battambang','Kampong Cham','Kampong Chhnang',
    'Kampong Speu','Kampong Thom','Kampot','Kandal','Kep','Koh Kong','Kratié',
    'Mondulkiri','Oddar Meanchey','Pailin','Preah Vihear','Prey Veng','Pursat',
    'Ratanakiri','Siem Reap','Sihanoukville','Stung Treng','Svay Rieng','Takéo','Tboung Khmum',
  ];

  // Seed all fields from context so returning restores the form
  const [fullName, setFullName] = useState(p.fullName || '')
  const [email, setEmail] = useState(p.email || '')
  const [gender, setGender] = useState(p.gender || 'prefer-not-to-say')
  const [birthDay, setBirthDay] = useState(p.birthDay || today.getDate())
  const [birthMonth, setBirthMonth] = useState(p.birthMonth || today.getMonth() + 1)
  const [birthYear, setBirthYear] = useState(p.birthYear || today.getFullYear())
  const [location, setLocation] = useState(p.location || '')
  const [phoneNumber, setPhoneNumber] = useState(p.phoneNumber || undefined)
  const [submitted, setSubmitted] = useState(false)

  const daysInSelectedMonth = getDaysinMonth(Number(birthMonth), Number(birthYear))
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1)
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const isFullNameValid = fullName.trim().length >= 2 && !/\d/.test(fullName)
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isBirthDateUnchanged = 
  Number(birthDay) === today.getDate() && 
  Number(birthMonth) === today.getMonth() + 1 && 
  Number(birthYear) === today.getFullYear();
  const isLocationValid = location !== ''
  const isPhoneValid = phoneNumber ? isValidPhoneNumber(phoneNumber) : false
  const isFormValid =
  isFullNameValid &&
  isEmailValid &&
  isLocationValid &&
  isPhoneValid &&
  birthDay && birthMonth && birthYear;

  // Auto-save to context whenever any field changes
  useEffect(() => {
    updatePersonal({ fullName, birthDay, birthMonth, birthYear, location, gender, phoneNumber, email })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, birthDay, birthMonth, birthYear, location, gender, phoneNumber, email])

  const handleNext = () => {
    setSubmitted(true)
    if (!isFormValid) return
    markStepComplete(2)
    navigate('/cv/step3')
  }

  const inputClass = (isValid) =>
    `w-full bg-surface/60 border rounded-lg px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
      submitted && !isValid
        ? 'border-red-400 ring-1 ring-red-400/40'
        : 'border-line focus:border-accent focus:ring-accent/40'
    }`

  // Bridge the existing day/month/year state to a single yyyy-mm-dd value.
  const pad = (n) => String(n).padStart(2, '0');
  const isoBirthDate =
    birthYear && birthMonth && birthDay
      ? `${birthYear}-${pad(birthMonth)}-${pad(birthDay)}`
      : '';
  const todayISO = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface text-content flex flex-col items-center py-6 px-4">
      <StepProgressBar currentStep={2} />
      <SuggestionBanner />

      <div className="w-full max-w-2xl bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-6 sm:p-8 mt-6 flex flex-col gap-6">

        <div>
          <h2 className="text-lg font-bold">Personal Information</h2>
          <p className="text-sm text-subtle mt-1">Basic details companies will use to reach you.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">Full Name</label>
          <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder='e.g. Sophea Chan'
          className={inputClass(isFullNameValid)}
          />
          {fullName.length > 0 && !isFullNameValid && (
            <p className="text-xs text-red-400 mt-1.5">
            {!/\d/.test(fullName) ? 'Please enter your full name' : 'Name cannot contain numbers'}
            </p>
          )}
          {submitted && fullName.length === 0 && (
            <p className="text-xs text-red-400 mt-1.5">Full name is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">Date of Birth</label>
          {/* Single date field — a real date picker beats three dropdowns, and it
              can't produce an impossible date like 31 Feb. The underlying
              day/month/year state is kept so validation + templates still work. */}
          <input
            type="date"
            value={isoBirthDate}
            max={todayISO}
            min="1950-01-01"
            onChange={(e) => {
              const v = e.target.value; // yyyy-mm-dd
              if (!v) { setBirthDay(''); setBirthMonth(''); setBirthYear(''); return; }
              const [y, m, d] = v.split('-');
              setBirthYear(String(Number(y)));
              setBirthMonth(String(Number(m)));
              setBirthDay(String(Number(d)));
            }}
            className="w-full bg-muted border border-line rounded-lg px-3 py-2.5 text-sm text-content
                       focus:border-accent focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
          />
          {isoBirthDate && (
            <p className="text-xs text-faint mt-1.5">
              {new Date(isoBirthDate).toLocaleDateString(undefined, {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          )}
          {isBirthDateUnchanged && (
            <p className="text-xs text-yellow-400 mt-1.5">
              This is today's date — please confirm or update your actual date of birth.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">Current Location</label>
          <div className={`inline-block rounded-lg ${submitted && !isLocationValid ? 'ring-1 ring-red-400/40' : ''}`}>
            <CustomSelect value={location} onChange={setLocation}
              options={cambodianProvinces.map((province) => ({ value: province, label: province}))}
              placeholder='Select your province...' />
          </div>
          {submitted && !isLocationValid && (
            <p className='text-xs text-red-400 mt-1.5'>Please select your location</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">Gender</label>
          <div className='inline-block'>
            <ToggleButtonGroup
            options={[
              { value: 'male', label: 'Male'},
              { value: 'female', label: 'Female'},
              { value: 'prefer-not-to-say', label: 'Prefer not to say'},
            ]}
            active={gender}
            onChange={setGender}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">Phone Number</label>
          <div className={`phone-input-wrapper rounded-lg ${submitted && !isPhoneValid ? 'ring-1 ring-red-400/50' : ''}`}>
            <PhoneInput international defaultCountry='KH' value={phoneNumber}
              onChange={setPhoneNumber}
              className={`phone-input-custom ${submitted && !isPhoneValid ? 'border-red-400!' : ''}`} />
          </div>
          {phoneNumber && !isPhoneValid && (
            <p className="text-xs text-red-400 mt-1.5">Please enter a valid phone number</p>
          )}
          {submitted && !phoneNumber && (
            <p className="text-xs text-red-400 mt-1.5">Phone number is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder='e.g. SopheaChan123@gmail.com' className={inputClass(isEmailValid)} />
          {email.length > 0 && !isEmailValid && (
            <p className="text-xs text-red-400 mt-1.5">Please enter a valid email</p>
          )}
          {submitted && email.length === 0 && (
            <p className="text-xs text-red-400 mt-1.5">Email is required</p>
          )}
        </div>

        <div className="flex justify-between items-center border-t border-line/80 pt-5 mt-1">
          <button onClick={() => navigate('/cv/step1')}
            className="px-6 py-2 bg-muted text-content font-semibold rounded-lg hover:bg-muted transition">
            ← Back
          </button>
          <button onClick={handleNext}
            className="px-6 py-2 bg-accent text-accent-ink font-semibold rounded-lg hover:bg-accent transition">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CVStep2Personal;