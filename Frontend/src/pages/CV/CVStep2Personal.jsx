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
    `w-full bg-slate-900/60 border rounded-lg px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
      submitted && !isValid
        ? 'border-red-400 ring-1 ring-red-400/40'
        : 'border-slate-700 focus:border-emerald-400 focus:ring-emerald-400/40'
    }`

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-6 px-4">
      <StepProgressBar currentStep={2} />
      <SuggestionBanner />

      <div className="w-full max-w-2xl bg-slate-800/60 border border-slate-700/80 rounded-2xl shadow-xl shadow-black/20 p-6 sm:p-8 mt-6 flex flex-col gap-6">

        <div>
          <h2 className="text-lg font-bold">Personal Information</h2>
          <p className="text-sm text-slate-400 mt-1">Basic details companies will use to reach you.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
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
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Date of Birth</label>
          <div className='flex gap-2'>
            <CustomSelect value={birthDay} onChange={setBirthDay}
              options={days.map((day) => ({ value: day, label: String(day) }))} placeholder="Day" />
            <CustomSelect value={birthMonth} onChange={(newMonth) => {
                setBirthMonth(newMonth)
                const newDaysInMonth = getDaysinMonth(Number(newMonth), Number(birthYear))
                if(birthDay && Number(birthDay) > newDaysInMonth) setBirthDay('');
              }}
              options={months.map((month, index) => ({ value: index + 1, label: month}))} placeholder='Month' />
            <CustomSelect value={birthYear} onChange={(newYear) => {
                setBirthYear(newYear)
                const newDaysInMonth = getDaysinMonth(Number(birthMonth), Number(newYear))
                if(birthDay && Number(birthDay) > newDaysInMonth) setBirthDay('');
              }}
              options={Array.from({ length: 100 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return { value: y, label: String(y) };
              })} placeholder="Year" />
          </div>
          {isBirthDateUnchanged && (
            <p className="text-xs text-yellow-400 mt-1.5">
              This is today's date — please confirm or update your actual date of birth.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Location</label>
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
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Gender</label>
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
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
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
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder='e.g. SopheaChan123@gmail.com' className={inputClass(isEmailValid)} />
          {email.length > 0 && !isEmailValid && (
            <p className="text-xs text-red-400 mt-1.5">Please enter a valid email</p>
          )}
          {submitted && email.length === 0 && (
            <p className="text-xs text-red-400 mt-1.5">Email is required</p>
          )}
        </div>

        <div className="flex justify-between items-center border-t border-slate-700/80 pt-5 mt-1">
          <button onClick={() => navigate('/cv/step1')}
            className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition">
            ← Back
          </button>
          <button onClick={handleNext}
            className="px-6 py-2 bg-emerald-400 text-slate-900 font-semibold rounded-lg hover:bg-emerald-300 transition">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CVStep2Personal;