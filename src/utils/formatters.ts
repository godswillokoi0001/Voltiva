/**
 * Formats amount into Nigerian Naira currency format (e.g., ₦25,400.00)
 */
export function formatNaira(amount: number, includeKobo: boolean = true): string {
  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: includeKobo ? 2 : 0,
    maximumFractionDigits: includeKobo ? 2 : 0,
  }).format(amount);
  
  return formatted.replace('NGN', '₦');
}

/**
 * Format standard Nigerian phone numbers (080..., 070..., 090..., 081...)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Validates Nigerian phone numbers
 */
export function validateNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && /^(070|080|081|090|091|071)/.test(cleaned)) {
    return true;
  }
  if (cleaned.length === 13 && cleaned.startsWith('234')) {
    return true;
  }
  return false;
}

/**
 * Generates a standard fintech transaction reference (e.g. VLT-TX-2026-987214)
 */
export function generateReference(prefix: string = 'VLT'): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${dateStr}-${random}`;
}

/**
 * Date formatter for Nigerian locale
 */
export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}
