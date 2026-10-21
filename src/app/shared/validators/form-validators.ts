import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PHONE_PATTERN = /^01[0125]\d{8}$/;

export interface PasswordRule {
  key: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    key: 'minLength',
    label: 'At least 8 characters',
    test: (v) => v.length >= 8,
  },
  {
    key: 'lowercase',
    label: 'A lowercase letter',
    test: (v) => /[a-z]/.test(v),
  },
  {
    key: 'uppercase',
    label: 'An uppercase letter',
    test: (v) => /[A-Z]/.test(v),
  },
  { key: 'number', label: 'A number', test: (v) => /\d/.test(v) },
  {
    key: 'symbol',
    label: 'A symbol, like ! @ # $',
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

export function passwordValidator(
  control: AbstractControl<string>,
): ValidationErrors | null {
  const value = control.value ?? '';
  const failed = PASSWORD_RULES.filter((rule) => !rule.test(value));

  return failed.length
    ? Object.fromEntries(failed.map((rule) => [rule.key, true]))
    : null;
}

export function matchValidator(
  controlName: string,
  otherName: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null =>
    group.get(controlName)?.value === group.get(otherName)?.value
      ? null
      : { mismatch: true };
}
