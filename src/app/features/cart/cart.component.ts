import { Component, computed, inject, signal } from '@angular/core';
import { CartFacade } from './services/cart.facade';
import { OrderNotesComponent } from './components/order-notes/order-notes.component';
import { AppHeaderComponent } from '../../shared/components/header/header.component';
import { CartItemCardComponent } from './components/cart-item-card/cart-item-card.component';
import { Router, RouterLink } from '@angular/router';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { AddOnsComponent } from './components/add-ons/add-ons.component';
import { MenuService } from '../menu/services/menu.service';
import { AddOnProduct, pickAddOns } from './utils/pick-add-ons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink,
    AppHeaderComponent,
    AddOnsComponent,
    CartItemCardComponent,
    OrderNotesComponent,
    OrderSummaryComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly cart = inject(CartFacade);
  private readonly menu = inject(MenuService);

  protected readonly items = this.cart.items;
  protected readonly count = this.cart.count;
  protected readonly subtotal = this.cart.subtotal;
  protected readonly discount = this.cart.discount;

  protected readonly notes = signal('');

  protected readonly addOns = computed(() =>
    pickAddOns(this.menu.menuGroups(), this.items()),
  );

  constructor() {
    this.menu.loadMenu();
  }

  protected onAddOn(product: AddOnProduct): void {
    this.cart.addItem(product, 1);
  }

  protected onConfirm(): void {
    if (!this.auth.isSignedIn()) {
      this.router.navigate(['/signin'], {
        queryParams: { returnUrl: '/cart' },
      });
      return;
    }
    //
  }
}
