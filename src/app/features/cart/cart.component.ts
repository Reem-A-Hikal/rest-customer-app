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
import { DeliveryAddressComponent } from './components/delivery-address/delivery-address.component';
import { AddressService } from '../address/services/address.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink,
    AppHeaderComponent,
    AddOnsComponent,
    CartItemCardComponent,
    DeliveryAddressComponent,
    OrderNotesComponent,
    OrderSummaryComponent,
    TranslocoPipe
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly cart = inject(CartFacade);
  private readonly menu = inject(MenuService);
  private readonly addressService = inject(AddressService);

  protected readonly items = this.cart.items;
  protected readonly count = this.cart.count;
  protected readonly subtotal = this.cart.subtotal;
  protected readonly discount = this.cart.discount;

  protected readonly notes = signal('');

  protected readonly isSignedIn = this.auth.isSignedIn;
  protected readonly addresses = this.addressService.addresses;
  protected readonly addressesLoading = this.addressService.loading;
  protected readonly selectedAddress = this.addressService.selectedAddress;

  protected readonly addOns = computed(() =>
    pickAddOns(this.menu.menuGroups(), this.items()),
  );

  protected readonly blockedReason = computed(() => {
    if (!this.isSignedIn()) return null;
    if (this.addressesLoading()) return 'cart.blocked.loading';
    if (this.addressService.error()) {
      return 'cart.blocked.error';
    }

    return this.selectedAddress() ? null : 'cart.blocked.noAddress';
  });

  constructor() {
    this.menu.loadMenu();
    this.addressService.load();
  }

  protected onAddOn(product: AddOnProduct): void {
    this.cart.addItem(product, 1);
  }

  protected onAddressSelected(addressId: number): void {
    this.addressService.select(addressId);
  }

  protected onConfirm(): void {
    if (!this.auth.isSignedIn()) {
      void this.router.navigate(['/signin'], {
        queryParams: { returnUrl: '/cart' },
      });
      return;
    }
    if (this.blockedReason()) return;
    // TODO: POST /Order
  }
}
