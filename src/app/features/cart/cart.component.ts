import { Component, inject, signal } from '@angular/core';
import { CartFacade } from './services/cart.facade';
import { OrderNotesComponent } from './components/order-notes/order-notes.component';
import { AppHeaderComponent } from '../../shared/components/header/header.component';
import { CartItemCardComponent } from './components/cart-item-card/cart-item-card.component';
import { RouterLink } from '@angular/router';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink,
    AppHeaderComponent,
    CartItemCardComponent,
    OrderNotesComponent,
    OrderSummaryComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  protected readonly cart = inject(CartFacade);

  protected readonly items = this.cart.items;
  protected readonly count = this.cart.count;
  protected readonly subtotal = this.cart.subtotal;
  protected readonly discount = this.cart.discount;

  protected readonly notes = signal('');

  protected onConfirm(): void {}
}
