import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { DishCartIntent } from '../../models/dish-cart-intent.model';
import { Product } from '../../models/menu.model';

@Directive()
export abstract class BaseDishCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() quantity = 0;
  @Output() cartIntent = new EventEmitter<DishCartIntent>();

  protected get hasDiscount(): boolean {
    return this.product.discountPercent > 0;
  }

  protected get displayPrice(): number {
    return this.hasDiscount ? this.product.discountedPrice : this.product.price;
  }

  protected onAdd(): void {
    this.cartIntent.emit({ type: 'add', product: this.product });
  }

  protected onIncrement(): void {
    this.cartIntent.emit({
      type: 'increment',
      productId: this.product.productId,
    });
  }

  protected onDecrement(): void {
    this.cartIntent.emit({
      type: 'decrement',
      productId: this.product.productId,
    });
  }
}
