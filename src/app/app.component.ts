import { Store } from '@ngrx/store';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { BackToTopComponent } from './shared/components/back-to-top/back-to-top.component';
import { CartActions } from './store/cart/cart.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, BackToTopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);

  title = 'rest-customer-app';

  ngOnInit(): void {
    this.store.dispatch(CartActions.loadCartFromStorage());
  }
}
