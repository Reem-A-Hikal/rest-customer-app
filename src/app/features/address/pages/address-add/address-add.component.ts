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
import { TranslocoPipe } from '@jsverse/transloco';

const MESSAGES = {
  addressLine1: {
    required: 'Street address is required',
    maxlength: 'Keep it under 255 characters',
  },
  addressLine2: { maxlength: 'Keep it under 255 characters' },
  city: { required: 'Choose your area' },
} as const;

type MessageField = keyof typeof MESSAGES;

@Component({
  selector: 'app-address-add',
  imports: [ReactiveFormsModule, AuthShellComponent, FormFieldComponent, TranslocoPipe],
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.css'],
})
export class AddressAddComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly addresses = inject(AddressService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly areas = DELIVERY_AREAS;

  private readonly returnUrl = safeReturnUrl(
    this.route.snapshot.queryParamMap.get('returnUrl'),
    'cart',
  );

  protected readonly addressTypes = [
    AddressType.Home,
    AddressType.Work,
    AddressType.Other,
  ].map((value) => ({ value, label: ADDRESS_TYPE_LABELS[value] }));

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
              'Could not save the address. Please try again.',
            ),
          ),
      });
  }
}
