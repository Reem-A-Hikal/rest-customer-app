import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Address,
  ADDRESS_TYPE_LABELS,
} from '../../../address/model/address.model';
import { LucideMapPin } from '@lucide/angular';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-delivery-address',
  imports: [RouterLink, LucideMapPin, TranslocoPipe],
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.css'],
})
export class DeliveryAddressComponent {
  readonly addresses = input.required<Address[]>();
  readonly selectedId = input<number | null>(null);
  readonly loading = input(false);

  readonly addressSelected = output<number>();

  protected readonly expanded = signal(false);
  protected readonly returnQuery = { returnUrl: '/cart' };

  protected readonly selected = computed(
    () =>
      this.addresses().find((a) => a.addressId === this.selectedId()) ?? null,
  );

  protected pick(addressId: number): void {
    this.addressSelected.emit(addressId);
    this.expanded.set(false);
  }

  protected typeLabel(address: Address): string {
    return ADDRESS_TYPE_LABELS[address.addressType];
  }

  protected line(address: Address): string {
    return [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.governorate,
    ]
      .filter(Boolean)
      .join(', ');
  }
}
