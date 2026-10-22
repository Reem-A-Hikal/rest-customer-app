import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';

export type Lang = 'en' | 'ar';

const STORAGE_KEY = 'rest_customer_lang';
const SUPPORTED: ReadonlySet<Lang> = new Set(['en', 'ar']);

function isLang(value: string | null): value is Lang {
  return SUPPORTED.has(value as Lang);
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);

  private readonly langSignal = signal<Lang>(this.detect());

  readonly lang = this.langSignal.asReadonly();
  readonly dir = computed(() => (this.langSignal() === 'ar' ? 'rtl' : 'ltr'));

  init(): Promise<unknown> {
    this.apply(this.langSignal());
    return firstValueFrom(this.transloco.load(this.langSignal()));
  }

  set(lang: Lang): void {
    this.langSignal.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    this.apply(lang);
  }

  toggle(): void {
    this.set(this.langSignal() === 'ar' ? 'en' : 'ar');
  }

  private apply(lang: Lang): void {
    this.transloco.setActiveLang(lang);

    const root = this.document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  private detect(): Lang {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;

    return navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en';
  }
}
