import { inject, Pipe, PipeTransform } from '@angular/core';
import { Lang, LanguageService } from './language.service';

interface HasName {
  name: string;
  nameAr?: string | null;
}

interface HasDescription {
  description: string | null;
  descriptionAr?: string | null;
}

export function localizedName(item: HasName, lang: Lang): string {
  const ar = item.nameAr?.trim();
  return lang === 'ar' && ar ? ar : item.name;
}

export function localizedDescription(
  item: HasDescription,
  lang: Lang,
): string | null {
  const ar = item.descriptionAr?.trim();
  return lang === 'ar' && ar ? ar : item.description;
}

@Pipe({ name: 'localizedName', pure: false })
export class LocalizedNamePipe implements PipeTransform {
  private readonly lang = inject(LanguageService).lang;

  transform(item: HasName): string {
    return localizedName(item, this.lang());
  }
}

@Pipe({ name: 'localizedDescription', pure: false })
export class LocalizedDescriptionPipe implements PipeTransform {
  private readonly lang = inject(LanguageService).lang;

  transform(item: HasDescription): string | null {
    return localizedDescription(item, this.lang());
  }
}
