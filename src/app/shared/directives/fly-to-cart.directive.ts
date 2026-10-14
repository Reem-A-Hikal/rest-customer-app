import { Directive, ElementRef, inject, HostListener } from '@angular/core';
import { CartFlyService } from '../services/cart-fly.service';

@Directive({
  selector: '[appFlyToCart]',
})
export class FlyToCartDirective {
  private readonly button = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cartFly = inject(CartFlyService);

  @HostListener('click')
  onClick(): void {
    this.cartFly.flyFrom(this.button.nativeElement);
  }
}
