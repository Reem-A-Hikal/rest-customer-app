import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartFlyService {
  private cartIcon: HTMLElement | null = null;

  readonly arrivals = signal(0);

  registerCartIcon(el: HTMLElement | null): void {
    this.cartIcon = el;
  }

  unregisterCartIcon(el: HTMLElement): void {
    if (this.cartIcon === el) this.cartIcon = null;
  }

  flyFrom(button: HTMLElement): void {
    if (!this.cartIcon) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const from = button.getBoundingClientRect();
    const to = this.cartIcon.getBoundingClientRect();
    const startX = from.left + from.width / 2;
    const startY = from.top + from.height / 2;
    const endX = to.left + to.width / 2;
    const endY = to.top + to.height / 2;

    const dx = endX - startX;
    const dy = endY - startY;

    const dot = document.createElement('span');
    dot.className =
      'fixed z-[200] size-5 rounded-full bg-accent-soft pointer-events-none';
    dot.style.left = `${startX - 10}px`;
    dot.style.top = `${startY - 10}px`;
    document.body.appendChild(dot);

    this.arrivals.update((count) => count + 1);

    const flight = dot.animate(
      [
        { transform: `translate(0, 0) scale(1)` },
        { transform: `translate(${dx / 2}px, ${dy / 2 - 60}px) scale(0.8)` },
        { transform: `translate(${dx}px, ${dy}px) scale(0.3)` },
      ],
      {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    );

    flight.onfinish = () => {
      dot.remove();
      this.arrivals.update((count) => count - 1);
    };
  }
}
