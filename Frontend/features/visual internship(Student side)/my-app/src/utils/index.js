/**
 * Joins truthy class name targets for clean conditional Tailwind strings
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Handles uniform format mapping for date indicators across user pipelines
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Standardizes currency representations for matching role packages
 */
export function formatSalary(amount, metric = 'hour') {
  if (!amount) return 'Competitive';
  return `$${amount} / ${metric}`;
}