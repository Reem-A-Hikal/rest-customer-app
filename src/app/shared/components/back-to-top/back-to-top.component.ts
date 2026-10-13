import { Component, HostListener, signal } from '@angular/core';
import { LucideArrowUp } from '@lucide/angular';
const SHOW_AFTER_PX = 400;
@Component({
  selector: 'app-back-to-top',
  imports: [LucideArrowUp],
  templateUrl: './back-to-top.component.html',
})
export class BackToTopComponent {
  private readonly visible = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.visible.set(window.scrollY > SHOW_AFTER_PX);
  }

  scrollToTop(): void {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }

  get buttonClasses(): string {
    const base =
      'fixed bottom-2xl end-md lg:bottom-md z-40 grid size-11 cursor-pointer place-items-center rounded-full ' +
      'border border-paper/30 bg-ink/92 text-paper backdrop-blur-[10px] ' +
      'transition-[opacity,translate,visibility,color,border-color] duration-300 ' +
      'hover:border-amber hover:text-amber ' +
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft ' +
      'motion-reduce:transition-none';

    return this.visible()
      ? `${base} visible translate-y-0 opacity-100`
      : `${base} invisible translate-y-2 opacity-0`;
  }
}
