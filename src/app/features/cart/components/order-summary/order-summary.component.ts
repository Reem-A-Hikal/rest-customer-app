import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { calculateOrderTotals } from '../../../../shared/utils/order-pricing';
import { LucideMoveRight, LucideClock, LucideCheck } from '@lucide/angular';

@Component({
  selector: 'app-order-summary',
  imports: [DecimalPipe, LucideMoveRight, LucideClock, LucideCheck],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
})
export class OrderSummaryComponent {
  readonly subtotal = input.required<number>();
  readonly discount = input(0);
  readonly itemCount = input.required<number>();

  readonly confirmed = output<void>();

  protected readonly totals = computed(() =>
    calculateOrderTotals(this.subtotal()),
  );

  protected readonly originalSubtotal = computed(
    () => this.subtotal() + this.discount(),
  );

  protected readonly assurances = [
    'HACCP Certified Precision Kitchen',
    'Tamper-evident heat-welded packaging',
    'Never reheated · Plated directly from pan to seal',
  ];
}
