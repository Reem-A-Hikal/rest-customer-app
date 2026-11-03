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
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { withLiveNames } from './utils/with-live-names';
import { finalize } from 'rxjs';
import { extractErrorMessage } from '../auth/utils/auth.utils';
import { PriceComponent } from '../../shared/components/price/price.component';
import { OrderService } from '../order/services/order.service';
import { PlacedOrder } from '../order/models/order.model';
import { LanguageService } from '../../core/i18n/language.service';
import { localizedName } from '../../core/i18n/localized';
import { formatClock } from '../../shared/utils/format-clock';
import { CheckoutConfigService } from './services/checkout-config.service';
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
    TranslocoPipe,
    PriceComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  private readonly checkout = inject(CheckoutConfigService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly lang = inject(LanguageService).lang;

  protected readonly cart = inject(CartFacade);
  private readonly menu = inject(MenuService);
  private readonly addressService = inject(AddressService);

  private readonly orders = inject(OrderService);
  private readonly transloco = inject(TranslocoService);

  protected readonly items = this.cart.items;
  protected readonly count = this.cart.count;
  protected readonly subtotal = this.cart.subtotal;
  protected readonly discount = this.cart.discount;

  protected readonly notes = signal('');

  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly placedOrder = signal<PlacedOrder | null>(null);

  protected readonly isSignedIn = this.auth.isSignedIn;
  protected readonly addresses = this.addressService.addresses;
  protected readonly addressesLoading = this.addressService.loading;
  protected readonly selectedAddress = this.addressService.selectedAddress;

  protected readonly addOns = computed(() =>
    pickAddOns(this.menu.menuGroups(), this.items()),
  );

  protected readonly displayItems = computed(() =>
    withLiveNames(this.items(), this.menu.menuGroups()),
  );

  protected readonly blockedReason = computed(() => {
    if (this.submitting()) return 'cart.blocked.submitting';

    if (this.checkout.deliveryFee() === null) {
      return this.checkout.error()
        ? 'cart.blocked.configError'
        : 'cart.blocked.configLoading';
    }
    
    if (this.checkout.acceptingOrders() === false) return 'cart.blocked.closed';

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
    this.checkout.refresh();
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

    const address = this.selectedAddress();
    if (!address) return;

    this.submitting.set(true);
    this.submitError.set(null);

    this.orders
      .create({
        deliveryAddressId: address.addressId,
        customerNotes: this.notes().trim() || undefined,
        orderDetails: this.items().map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
      })
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (order) => {
          this.cart.clear();
          this.notes.set('');
          this.placedOrder.set(order);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err: unknown) => this.submitError.set(this.toErrorMessage(err)),
      });
  }

  private toErrorMessage(err: unknown): string {
    return extractErrorMessage(
      err,
      (key, params) => this.transloco.translate(key, params),
      'cart.errors.submit',
      (code, params) => {
        switch (code) {
          case 'KITCHEN_CLOSED':
            return {
              ...params,
              opensAt: formatClock(String(params['opensAt']), this.lang()),
              closesAt: formatClock(String(params['closesAt']), this.lang()),
            };
          case 'PRODUCT_UNAVAILABLE': {
            const item = this.displayItems().find(
              (i) => i.productId === params['productId'],
            );
            return item
              ? { ...params, productName: localizedName(item, this.lang()) }
              : params;
          }
          default:
            return params;
        }
      },
    );
  }
}
