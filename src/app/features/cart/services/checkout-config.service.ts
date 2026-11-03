import { finalize } from 'rxjs';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { CheckoutConfig } from '../models/checkout-config.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutConfigService {
  private readonly api = inject(ApiService);

  private readonly config = signal<CheckoutConfig | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal(false);

  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly deliveryFee = computed(() => this.config()?.deliveryFee ?? null);
  readonly acceptingOrders = computed(
    () => this.config()?.acceptingOrders ?? null,
  );
  readonly orderWindow = computed(() => this.config()?.orderWindow ?? null);
  readonly estimate = computed(() => this.config()?.deliveryEstimate ?? null);

  refresh(): void {
    if (this.loadingState()) return;

    this.loadingState.set(true);
    this.errorState.set(false);

    this.api
      .get<CheckoutConfig>('/checkout-config')
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: (config) => this.config.set(config),
        error: () => this.errorState.set(true),
      });
  }
}
