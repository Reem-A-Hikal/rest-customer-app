import { Component, computed, input, output } from '@angular/core';
import { calculateOrderTotals } from '../../../../shared/utils/order-pricing';
import { LucideMoveRight, LucideClock, LucideCheck } from '@lucide/angular';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-order-summary',
  imports: [PriceComponent,TranslocoPipe, LucideMoveRight, LucideClock, LucideCheck],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
})
export class OrderSummaryComponent {
  readonly subtotal = input.required<number>();
  readonly discount = input(0);
  readonly itemCount = input.required<number>();
  readonly blockedReason = input<string | null>(null);

  readonly confirmed = output<void>();

  protected readonly totals = computed(() =>
    calculateOrderTotals(this.subtotal()),
  );

  protected readonly originalSubtotal = computed(
    () => this.subtotal() + this.discount(),
  );

  protected readonly assurances = [
    'cart.summary.assurances.haccp',
    'cart.summary.assurances.sealed',
    'cart.summary.assurances.fresh',
  ];
}
