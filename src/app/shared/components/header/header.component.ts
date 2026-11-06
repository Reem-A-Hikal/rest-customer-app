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
import { Router, RouterLink } from '@angular/router';
import {
  LucideLogOut,
  LucideMenu,
  LucidePaperBag,
  LucideShoppingCart,
  LucideUser,
  LucideX,
} from '@lucide/angular';
import { CartFacade } from '../../../features/cart/services/cart.facade';
import { CartFlyService } from '../../services/cart-fly.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth.service';

const AUTH_ONLY_PATHS = ['/orders', '/addresses'];
@Component({
  selector: 'app-header',
  imports: [
    BrandLogoComponent,
    RouterLink,
    LucideMenu,
    LucideShoppingCart,
    LucideX,
    LucideUser,
    LucideLogOut,
    LucidePaperBag,
    TranslocoPipe,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class AppHeaderComponent {
  protected readonly language = inject(LanguageService);
  private readonly cartFly = inject(CartFlyService);
  private readonly cartLink = viewChild<ElementRef<HTMLElement>>('cartLink');

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly accountWrap =
    viewChild<ElementRef<HTMLElement>>('accountWrap');

  private readonly cartFacade = inject(CartFacade);
  readonly cartCount = this.cartFacade.count;

  protected readonly user = this.auth.user;
  protected readonly isSignedIn = this.auth.isSignedIn;
  protected readonly accountOpen = signal(false);

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
    this.accountOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.accountOpen()) return;

    const wrap = this.accountWrap()?.nativeElement;
    if (wrap && !wrap.contains(event.target as Node)) {
      this.accountOpen.set(false);
    }
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected toggleAccount(): void {
    this.accountOpen.update((open) => !open);
  }

  protected signOut(): void {
    this.accountOpen.set(false);
    this.auth.logout();

    if (AUTH_ONLY_PATHS.some((path) => this.router.url.startsWith(path))) {
      void this.router.navigate(['/']);
    }
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
