import { Lang } from '../../core/i18n/language.service';

export function formatClock(hhmm: string, lang: Lang): string {
  const [hours, minutes] = hhmm.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return hhmm;

  const date = new Date(2000, 0, 1, hours, minutes);
  const local = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

  return new Intl.DateTimeFormat(local, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
