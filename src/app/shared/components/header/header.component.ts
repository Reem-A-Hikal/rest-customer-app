import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';
import { RouterLink } from '@angular/router';
import { LucideMenu, LucideShoppingCart, LucideX } from '@lucide/angular';
import { CartFacade } from '../../../features/cart/services/cart.facade';
import { CartFlyService } from '../../services/cart-fly.service';

@Component({
  selector: 'app-header',
  imports: [
    BrandLogoComponent,
    RouterLink,
    LucideMenu,
    LucideShoppingCart,
    LucideX,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class AppHeaderComponent {
  private readonly cartFly = inject(CartFlyService);
  private readonly cartLink = viewChild<ElementRef<HTMLElement>>('cartLink');

  private readonly cartFacade = inject(CartFacade);
  readonly cartCount = this.cartFacade.count;

  protected readonly shownCount = computed(() =>
    Math.max(0, this.cartCount() - this.cartFly.arrivals()),
  );

  readonly showMenuToggle = input(true);
  private readonly isScrolled = signal(false);
  readonly isOpen = signal(false);

  constructor() {
    effect(() => {
      this.cartFly.registerCartIcon(this.cartLink()?.nativeElement ?? null);
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 10);
  }

  @HostListener('document:keydown.escape')
  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  onPanelClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('a, button')) {
      this.close();
    }
  }

  get headerStateClasses(): string {
    return this.isScrolled()
      ? 'bg-ink/95 lg:bg-ink/92 lg:backdrop-blur-[10px] py-sm shadow-[0_1px_0_0_rgba(250,247,242,0.16)]'
      : 'bg-transparent py-md';
  }

  get panelClasses(): string {
    const base =
      'fixed inset-0 z-0 flex flex-col justify-between overflow-y-auto bg-ink px-lg pb-lg pt-24 ' +
      'transition-[opacity,translate,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ' +
      'lg:visible lg:contents';

    return this.isOpen()
      ? `${base} visible translate-y-0 opacity-100`
      : `${base} invisible -translate-y-6 opacity-0`;
  }
}
