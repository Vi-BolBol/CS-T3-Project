// Shared validation helpers used across the job creation wizard.

export function isBlank(value) {
  return !value || String(value).trim() === '';
}

// Strips any formatting (dashes, spaces) before checking.
export function isValidCardNumber(value) {
  const digits = (value || '').replace(/\D+/g, '');
  if (!/^\d{13,19}$/.test(digits)) return false;

  // Luhn checksum
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// Formats a raw digit string as "1234-1234-1234-1234" (groups of 4).
export function formatCardNumber(digits) {
  return digits.replace(/(.{4})/g, '$1-').replace(/-$/, '');
}

// Expects two 2-digit segments (month, year). Checks the month is valid
// and that the resulting date hasn't already passed.
export function isValidExpiryParts(month, year) {
  if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) return false;

  const m = parseInt(month, 10);
  const y = parseInt(year, 10) + 2000;
  if (m < 1 || m > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (y < currentYear) return false;
  if (y === currentYear && m < currentMonth) return false;

  return true;
}

export function isValidCVC(value) {
  return /^\d{3,4}$/.test((value || '').trim());
}