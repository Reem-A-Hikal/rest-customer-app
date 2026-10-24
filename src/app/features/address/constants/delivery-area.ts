// The kitchen delivers within Cairo Governorate only,
export const DELIVERY_GOVERNORATE = 'Cairo';

// Areas inside Cairo Governorate (alphabetical, as shown in the dropdown).
export const DELIVERY_AREAS = [
  { value: 'Abbasia', labelKey: 'address.areas.abbasia' },
  { value: 'Downtown', labelKey: 'address.areas.downtown' },
  { value: 'Garden City', labelKey: 'address.areas.gardenCity' },
  { value: 'Heliopolis', labelKey: 'address.areas.heliopolis' },
  { value: 'Maadi', labelKey: 'address.areas.maadi' },
  { value: 'Mokattam', labelKey: 'address.areas.mokattam' },
  { value: 'Nasr City', labelKey: 'address.areas.nasrCity' },
  { value: 'Old Cairo', labelKey: 'address.areas.oldCairo' },
  { value: 'Sayeda Zeinab', labelKey: 'address.areas.sayedaZeinab' },
  { value: 'Shubra', labelKey: 'address.areas.shubra' },
  { value: 'Zamalek', labelKey: 'address.areas.zamalek' },
  { value: 'Zeitoun', labelKey: 'address.areas.zeitoun' },
] as const;

export const AREA_LABEL_KEYS: ReadonlyMap<string, string> = new Map<
  string,
  string
>(DELIVERY_AREAS.map((area) => [area.value, area.labelKey] as const));
