import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import {
  extractErrorMessage,
  safeReturnUrl,
} from '../../../auth/utils/auth.utils';
import { ADDRESS_TYPE_LABELS, AddressType } from '../../model/address.model';
import { firstError } from '../../../../shared/validators/form-validators';
import { finalize } from 'rxjs';
import { AuthShellComponent } from '../../../auth/auth-shell/auth-shell.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import {
  DELIVERY_AREAS,
  DELIVERY_GOVERNORATE,
} from '../../constants/delivery-area';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

const MESSAGES = {
  addressLine1: {
    required: 'address.errors.line1Required',
    maxlength: 'address.errors.line1Max',
  },
  addressLine2: { maxlength: 'address.errors.line2Max' },
  city: { required: 'address.errors.areaRequired' },
} as const;

type MessageField = keyof typeof MESSAGES;

@Component({
  selector: 'app-address-add',
  imports: [
    ReactiveFormsModule,
    AuthShellComponent,
    FormFieldComponent,
    TranslocoPipe,
  ],
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.css'],
})
export class AddressAddComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly addresses = inject(AddressService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly areas = DELIVERY_AREAS;
  private readonly transloco = inject(TranslocoService);

  private readonly returnUrl = safeReturnUrl(
    this.route.snapshot.queryParamMap.get('returnUrl'),
    'cart',
  );

  protected readonly addressTypes = [
    AddressType.Home,
    AddressType.Work,
    AddressType.Other,
  ].map((value) => ({ value, labelKey: ADDRESS_TYPE_LABELS[value] }));

  protected readonly form = this.fb.group({
    addressType: [AddressType.Home],
    addressLine1: ['', [Validators.required, Validators.maxLength(255)]],
    addressLine2: ['', Validators.maxLength(255)],
    city: ['', [Validators.required, Validators.maxLength(100)]],
  });

  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected fieldError(name: MessageField): string | null {
    const messages: Record<string, string> = MESSAGES[name];
    return firstError(this.form.controls[name], messages);
  }

  protected cancel(): void {
    void this.router.navigateByUrl(this.returnUrl);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { addressType, addressLine1, addressLine2, city } =
      this.form.getRawValue();

    this.submitting.set(true);
    this.serverError.set(null);

    this.addresses
      .create({
        addressType,
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        governorate: DELIVERY_GOVERNORATE,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl(this.returnUrl),
        error: (err: unknown) =>
          this.serverError.set(
            extractErrorMessage(
              err,
              (key) => this.transloco.translate(key),
              'address.add.failed',
            ),
          ),
      });
  }
}
