import { Component, computed, input, output } from '@angular/core';
import { CartItem } from '../../../../shared/models/cart-item.model';
import { QtyControlComponent } from '../../../menu/components/qty-control/qty-control.component';
import { DishImageComponent } from '../../../menu/components/dish-image/dish-image.component';
import { DecimalPipe } from '@angular/common';
import { LucideTrash } from '@lucide/angular';

@Component({
  selector: 'app-cart-item-card',
  imports: [QtyControlComponent, DishImageComponent, DecimalPipe, LucideTrash],
  templateUrl: './cart-item-card.component.html',
  styleUrls: ['./cart-item-card.component.css'],
})
export class CartItemCardComponent {
  readonly item = input.required<CartItem>();

  readonly increment = output<void>();
  readonly decrement = output<void>();
  readonly remove = output<void>();

  protected readonly lineTotal = computed(
    () => this.item().discountedPrice * this.item().quantity,
  );
  protected readonly originalLineTotal = computed(
    () => this.item().price * this.item().quantity,
  );
  protected readonly discounted = computed(
    () => this.item().discountedPrice < this.item().price,
  );
}
