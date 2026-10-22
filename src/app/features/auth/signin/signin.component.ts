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
import { AuthService } from '../../../core/services/auth.service';
import { EMAIL_PATTERN } from '../../../shared/validators/form-validators';
import { finalize } from 'rxjs';
import { extractErrorMessage, safeReturnUrl } from '../utils/auth.utils';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-signin',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthShellComponent,
    FormFieldComponent,
    PasswordFieldComponent,
    TranslocoPipe,
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly transloco = inject(TranslocoService);

  private readonly returnUrl =
    this.route.snapshot.queryParamMap.get('returnUrl');

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    password: ['', Validators.required],
  });

  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected readonly returnQuery = this.returnUrl
    ? { returnUrl: this.returnUrl }
    : {};

  protected emailError(): string | null {
    const control = this.form.controls.email;
    if (!control.touched || !control.errors) return null;

    return control.hasError('required')
      ? 'auth.errors.emailRequired'
      : 'auth.errors.emailInvalid';
  }

  protected passwordError(): string | null {
    const control = this.form.controls.password;
    return control.touched && control.hasError('required')
      ? 'auth.errors.passwordRequired'
      : null;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.serverError.set(null);

    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl(safeReturnUrl(this.returnUrl)),
        error: (err: unknown) =>
          this.serverError.set(
            extractErrorMessage(
              err,
              this.transloco.translate('auth.signin.failed')
            ),
          ),
      });
  }
}
