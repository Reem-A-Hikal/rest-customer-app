import { Component, computed, inject, input, output } from '@angular/core';
import { calculateOrderTotals } from '../../../../shared/utils/order-pricing';
import { LucideMoveRight, LucideClock, LucideCheck } from '@lucide/angular';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { CheckoutConfigService } from '../../services/checkout-config.service';
import { LanguageService } from '../../../../core/i18n/language.service';
import { formatClock } from '../../../../shared/utils/format-clock';

@Component({
  selector: 'app-order-summary',
  imports: [
    PriceComponent,
    TranslocoPipe,
    LucideMoveRight,
    LucideClock,
    LucideCheck,
  ],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
})
export class OrderSummaryComponent {
  private readonly checkout = inject(CheckoutConfigService);
  private readonly lang = inject(LanguageService).lang;

  readonly subtotal = input.required<number>();
  readonly discount = input(0);
  readonly itemCount = input.required<number>();
  readonly blockedReason = input<string | null>(null);

  readonly confirmed = output<void>();

  protected readonly feeKnown = computed(
    () => this.checkout.deliveryFee() !== null,
  );

  protected readonly totals = computed(() =>
    calculateOrderTotals(this.subtotal(), this.checkout.deliveryFee() ?? 0),
  );

  protected readonly originalSubtotal = computed(
    () => this.subtotal() + this.discount(),
  );

  protected readonly estimate = this.checkout.estimate;

  protected readonly hoursParams = computed(() => {
    const window = this.checkout.orderWindow();
    if (!window) return null;

    return {
      opensAt: formatClock(window.opensAt, this.lang()),
      closesAt: formatClock(window.closesAt, this.lang()),
    };
  });

  protected readonly assurances = [
    'cart.summary.assurances.haccp',
    'cart.summary.assurances.sealed',
    'cart.summary.assurances.fresh',
  ];
}
