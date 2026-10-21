import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthShellComponent } from '../auth-shell/auth-shell.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { PasswordFieldComponent } from '../../../shared/components/password-field/password-field.component';
import {
  EMAIL_PATTERN,
  matchValidator,
  PASSWORD_RULES,
  PasswordRule,
  passwordValidator,
  PHONE_PATTERN,
} from '../../../shared/validators/form-validators';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';
import { extractErrorMessage, safeReturnUrl } from '../utils/auth.utils';
import { LucideCheck, LucideDot } from '@lucide/angular';

const MESSAGES = {
  fullName: {
    required: 'Full name is required',
    minlength: 'Enter at least 3 characters',
    maxlength: 'Keep it under 100 characters',
  },
  email: {
    required: 'Email is required',
    pattern: 'Enter a valid email address',
  },
  phoneNumber: {
    pattern: 'Enter an 11-digit mobile number, e.g. 01012345678',
  },
} as const;

type MessageField = keyof typeof MESSAGES;

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthShellComponent,
    FormFieldComponent,
    PasswordFieldComponent,
    LucideCheck,
    LucideDot,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly returnUrl =
    this.route.snapshot.queryParamMap.get('returnUrl');

  protected readonly passwordRules = PASSWORD_RULES;

  protected readonly form = this.fb.group(
    {
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      phoneNumber: ['', Validators.pattern(PHONE_PATTERN)],
      password: ['', [Validators.required, passwordValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: matchValidator('password', 'confirmPassword') },
  );

  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected readonly returnQuery = this.returnUrl
    ? { returnUrl: this.returnUrl }
    : {};

  protected fieldError(name: MessageField): string | null {
    const control = this.form.controls[name];
    if (!control.touched || !control.errors) return null;

    const [firstKey] = Object.keys(control.errors);

    const messages: Record<string, string> = MESSAGES[name];
    return messages[firstKey] ?? 'Invalid value';
  }

  protected passwordError(): string | null {
    const control = this.form.controls.password;
    return control.touched && control.hasError('required')
      ? 'Password is required'
      : null;
  }

  protected confirmError(): string | null {
    const control = this.form.controls.confirmPassword;
    if (!control.touched) return null;
    if (control.hasError('required')) return 'Please confirm your password';

    return this.form.hasError('mismatch') ? 'Passwords do not match' : null;
  }

  protected ruleMet(rule: PasswordRule): boolean {
    return rule.test(this.form.controls.password.value);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, phoneNumber, password, confirmPassword } =
      this.form.getRawValue();

    this.submitting.set(true);
    this.serverError.set(null);

    this.auth
      .register({
        fullName: fullName.trim(),
        email,
        phoneNumber: phoneNumber || undefined,
        password,
        confirmPassword,
      })
      .pipe(
        // Register doesn't return a token, so sign the new customer in right away
        switchMap(() =>
          this.auth.login({ email, password }).pipe(
            catchError(() => {
              // Account exists but the automatic sign-in failed: let them sign in manually
              this.router.navigate(['/signin'], {
                queryParams: this.returnQuery,
              });
              return EMPTY;
            }),
          ),
        ),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: () => this.router.navigateByUrl(safeReturnUrl(this.returnUrl)),
        error: (err: unknown) =>
          this.serverError.set(
            extractErrorMessage(
              err,
              'Could not create your account. Please try again.',
            ),
          ),
      });
  }
}
