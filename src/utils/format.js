export const formatCurrency = (amount, locale = 'fr') => {
  if (amount == null || Number.isNaN(Number(amount))) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
  }).format(Number(amount));
};

export const formatDate = (date, locale = 'fr') => {
  if (!date) return '—';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date, locale = 'fr') => {
  if (!date) return '—';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatRelativeDate = (date, locale = 'fr') => {
  if (!date) return '—';
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (diffDays === 0) return rtf.format(0, 'day');
  if (diffDays < 7) return rtf.format(-diffDays, 'day');
  return formatDate(date, locale);
};
