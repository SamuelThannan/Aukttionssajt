const priceFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatPrice = (amount) => priceFormatter.format(amount);

export const formatDate = (value) => dateFormatter.format(new Date(value));

// Text för hur länge en auktion pågår, t.ex. "2 d 4 h kvar"
export function formatTimeLeft(endDate, now = new Date()) {
  const diff = new Date(endDate) - now;
  if (diff <= 0) return 'Avslutad';

  const minutes = Math.floor(diff / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  if (days > 0) return `${days} d ${hours} h kvar`;
  if (hours > 0) return `${hours} h ${mins} min kvar`;
  return `${Math.max(mins, 1)} min kvar`;
}

export const isEndingSoon = (endDate) => {
  const diff = new Date(endDate) - new Date();
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
};

// Värde till <input type="datetime-local"> i lokal tid
export function toDateTimeLocal(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
