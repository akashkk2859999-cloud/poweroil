export function generateParticipantCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `MCN-${suffix}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function buildParticipantSlug(fullName: string, code: string): string {
  return `${slugify(fullName)}-${code.toLowerCase()}`;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, '').replace(/^0/, '+234');
}
