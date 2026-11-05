import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { AppHeaderComponent } from '../../../../shared/components/header/header.component';
import { LanguageService } from '../../../../core/i18n/language.service';
import { OrderService } from '../../services/order.service';
import {
  CUSTOMER_CANCELLABLE,
  Order,
  OrderItem,
  OrderStatus,
} from '../../models/order.model';
import { filter, finalize, interval, map } from 'rxjs';
import { localizedName } from '../../../../core/i18n/localized';
import { parseServerDate } from '../../../../shared/utils/parse-server-date';
import { extractErrorMessage } from '../../../auth/utils/auth.utils';
import { MenuService } from '../../../menu/services/menu.service';
import { CartFacade } from '../../../cart/services/cart.facade';
import { toAssetUrl } from '../../../../shared/helpers/url.helper';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { toCartItem } from '../../../cart/utils/to-cart-item';
import { LucideCheck, LucideClock } from '@lucide/angular';
import { CategoryTabsComponent } from '../../../menu/components/category-tabs/category-tabs.component';

type OrdersTab = 'all' | 'active' | 'past';
type StepState = 'done' | 'current' | 'upcoming';
@Component({
  selector: 'app-orders',
  imports: [
    AppHeaderComponent,
    PriceComponent,
    CategoryTabsComponent,
    RouterLink,
    TranslocoPipe,
    LucideCheck,
    LucideClock,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly transloco = inject(TranslocoService);
  private readonly lang = inject(LanguageService).lang;
  private readonly menu = inject(MenuService);
  private readonly cart = inject(CartFacade);

  protected readonly OrderStatus = OrderStatus;
  protected readonly toAssetUrl = toAssetUrl;

  protected readonly steps = [
    OrderStatus.Confirmed,
    OrderStatus.Preparing,
    OrderStatus.Ready,
    OrderStatus.OutForDelivery,
    OrderStatus.Delivered,
  ] as const;

  // protected readonly tabs: { id: OrdersTab; labelKey: string }[] = [
  //   { id: 'all', labelKey: 'orders.tabs.all' },
  //   { id: 'active', labelKey: 'orders.tabs.active' },
  //   { id: 'past', labelKey: 'orders.tabs.past' },
  // ];

  private readonly tabLabels = toSignal(
    this.transloco.selectTranslateObject<Record<OrdersTab, string>>(
      'orders.tabs',
    ),
  );

  protected readonly tabItems = computed(() => {
    const labels = this.tabLabels();

    return (['all', 'active', 'past'] as const).map((id) => ({
      id,
      name: labels?.[id] ?? '',
      count: this.countFor(id),
    }));
  });

  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly orders = signal<Order[]>([]);
  protected readonly tab = signal<OrdersTab>('all');

  protected readonly cancellingId = signal<number | null>(null);
  protected readonly reason = signal('');
  protected readonly cancelBusy = signal(false);
  protected readonly cancelError = signal<string | null>(null);

  protected readonly reorderResult = signal<{
    orderId: number;
    added: number;
    missing: number;
  } | null>(null);

  protected readonly hasOrders = computed(() => this.orders().length > 0);

  protected readonly activeOrders = computed(() =>
    this.orders().filter((o) => o.status <= OrderStatus.OutForDelivery),
  );
  protected readonly pastOrders = computed(() =>
    this.orders().filter((o) => o.status > OrderStatus.OutForDelivery),
  );
  protected readonly showActive = computed(() => this.tab() !== 'past');
  protected readonly showPast = computed(() => this.tab() !== 'active');

  /** Reorder needs the live menu; until it's loaded every dish would look unavailable. */
  protected readonly menuReady = computed(
    () => !this.menu.loading() && this.menu.menuGroups().length > 0,
  );

  constructor() {
    // Staff move the order along in the dashboard; poll while something is in progress.
    interval(30_000)
      .pipe(
        filter(
          () => this.activeOrders().length > 0 && this.cancellingId() === null,
        ),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.refreshQuietly());
  }

  ngOnInit(): void {
    this.load();
    this.menu.loadMenu();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);

    this.orderService
      .myOrders()
      .pipe(
        map((orders) => this.newestFirst(orders)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (orders) => this.orders.set(orders),
        error: (err: unknown) => {
          console.error('Failed to load orders', err);
          this.loadFailed.set(true);
        },
      });
  }

  protected countFor(tab: OrdersTab): number {
    switch (tab) {
      case 'active':
        return this.activeOrders().length;
      case 'past':
        return this.pastOrders().length;
      default:
        return this.orders().length;
    }
  }

  protected canCancel(order: Order): boolean {
    return CUSTOMER_CANCELLABLE.includes(order.status);
  }

  protected statusKey(order: Order): string {
    return `orders.status.${OrderStatus[order.status]}`;
  }

  protected stepKey(step: OrderStatus): string {
    return `orders.status.${OrderStatus[step]}`;
  }

  protected stepState(order: Order, step: OrderStatus): StepState {
    if (order.status > step) return 'done';
    return order.status === step ? 'current' : 'upcoming';
  }

  protected stepTone(state: StepState): string {
    switch (state) {
      case 'done':
        return 'border-accent-soft bg-accent-soft text-ink';
      case 'current':
        return 'border-accent-soft text-accent-soft';
      default:
        return 'border-outline text-warm-grey';
    }
  }

  protected statusTone(order: Order): string {
    switch (order.status) {
      case OrderStatus.Cancelled:
        return 'border-danger/40 text-danger';
      case OrderStatus.Delivered:
        return 'border-outline text-paper';
      default:
        return 'border-accent-soft/40 text-accent-soft';
    }
  }

  protected itemName(item: OrderItem): string {
    return localizedName(
      { name: item.productName, nameAr: item.productNameAr },
      this.lang(),
    );
  }

  protected itemCount(order: Order): number {
    return order.orderDetails.reduce((sum, item) => sum + item.quantity, 0);
  }

  protected placedAt(order: Order): string {
    return new Intl.DateTimeFormat(this.locale(), {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Africa/Cairo',
    }).format(parseServerDate(order.orderDate));
  }

  protected expectedBy(order: Order): string | null {
    const minutes = order.estimatedDeliveryTime;
    if (!minutes) return null;

    const at = parseServerDate(order.orderDate).getTime() + minutes * 60_000;
    return new Intl.DateTimeFormat(this.locale(), {
      timeStyle: 'short',
      timeZone: 'Africa/Cairo',
    }).format(at);
  }

  protected reorder(order: Order): void {
    const available = new Map(
      this.menu
        .menuGroups()
        .flatMap((group) => group.products)
        .map((product) => [product.productId, product] as const),
    );

    let added = 0;
    let missing = 0;

    for (const item of order.orderDetails) {
      const product = available.get(item.productId);
      if (!product) {
        missing++;
        continue;
      }
      this.cart.addItem(toCartItem(product), item.quantity);
      added++;
    }

    this.reorderResult.set({ orderId: order.orderId, added, missing });
  }

  protected openCancel(order: Order): void {
    this.cancellingId.set(order.orderId);
    this.reason.set('');
    this.cancelError.set(null);
  }

  protected closeCancel(): void {
    this.cancellingId.set(null);
  }

  protected confirmCancel(order: Order): void {
    if (this.cancelBusy()) return;

    this.cancelBusy.set(true);
    this.cancelError.set(null);

    this.orderService
      .cancel(order.orderId, this.reason().trim() || 'Cancelled by customer')
      .pipe(finalize(() => this.cancelBusy.set(false)))
      .subscribe({
        next: (updated) => {
          this.orders.update((list) =>
            list.map((o) => (o.orderId === updated.orderId ? updated : o)),
          );
          this.cancellingId.set(null);
        },
        error: (err: unknown) => {
          this.cancelError.set(
            extractErrorMessage(
              err,
              (key, params) => this.transloco.translate(key, params),
              'orders.cancel.failed',
            ),
          );
          this.refreshQuietly(); // the kitchen may have moved the order on
        },
      });
  }

  private refreshQuietly(): void {
    this.orderService.myOrders().subscribe({
      next: (orders) => this.orders.set(this.newestFirst(orders)),
    });
  }

  private locale(): string {
    return this.lang() === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB';
  }

  private newestFirst(orders: Order[]): Order[] {
    return [...orders].sort(
      (a, b) =>
        parseServerDate(b.orderDate).getTime() -
        parseServerDate(a.orderDate).getTime(),
    );
  }
}
