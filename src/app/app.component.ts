import { Store } from '@ngrx/store';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { BackToTopComponent } from './shared/components/back-to-top/back-to-top.component';
import { CartActions } from './store/cart/cart.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { FooterCompactComponent } from './shared/components/footer-compact/footer-compact.component';

type FooterVariant = 'full' | 'compact' | 'none';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FooterComponent,
    BackToTopComponent,
    FooterCompactComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  title = 'rest-customer-app';

  protected readonly footer = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((): FooterVariant => this.currentFooterVariant()),
    ),
    { initialValue: 'none' as FooterVariant },
  );

  ngOnInit(): void {
    this.store.dispatch(CartActions.loadCartFromStorage());
  }

  private currentFooterVariant(): FooterVariant {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;

    return route.data['footer'] ?? 'full';
  }
}
