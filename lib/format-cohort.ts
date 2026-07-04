/** Format question cohort YYYY-MM as "Added Mar 2026". */
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatCohort(cohort: string): string {
  const m = cohort.match(/^(\d{4})-(\d{2})$/);
  if (!m) return cohort;
  const month = parseInt(m[2], 10);
  if (month < 1 || month > 12) return cohort;
  return `Added ${MONTHS[month - 1]} ${m[1]}`;
}
