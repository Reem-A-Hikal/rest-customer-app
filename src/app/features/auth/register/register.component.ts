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
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

const MESSAGES = {
  fullName: {
    required: 'auth.errors.nameRequired',
    minlength: 'auth.errors.nameMin',
    maxlength: 'auth.errors.nameMax',
  },
  email: {
    required: 'auth.errors.emailRequired',
    pattern: 'auth.errors.emailInvalid',
  },
  phoneNumber: {
    pattern: 'auth.errors.phoneInvalid',
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
    TranslocoPipe,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly transloco = inject(TranslocoService);

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
      ? 'auth.errors.passwordRequired'
      : null;
  }

  protected confirmError(): string | null {
    const control = this.form.controls.confirmPassword;
    if (!control.touched) return null;
    if (control.hasError('required')) return 'auth.errors.confirmRequired';

    return this.form.hasError('mismatch')
      ? 'auth.errors.passwordMismatch'
      : null;
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
        switchMap(() =>
          this.auth.login({ email, password }).pipe(
            catchError(() => {
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
              (key) => this.transloco.translate(key),
              'auth.register.failed',
            ),
          ),
      });
  }
}
