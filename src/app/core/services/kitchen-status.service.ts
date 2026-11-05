import { computed, inject, Injectable, OnDestroy } from '@angular/core';
import { CheckoutConfigService } from '../../features/cart/services/checkout-config.service';

@Injectable({
  providedIn: 'root',
})
export class KitchenStatusService implements OnDestroy {
  private readonly checkout = inject(CheckoutConfigService);

  private readonly intervalId = setInterval(
    () => this.checkout.refresh(),
    60_000,
  );

  readonly isOpen = computed(() => this.checkout.acceptingOrders() === true);

  constructor() {
    this.checkout.refresh();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
