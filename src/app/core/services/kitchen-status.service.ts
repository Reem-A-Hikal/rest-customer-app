import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import { isKitchenOpen } from '../../shared/utils/kitchen-hours';

@Injectable({
  providedIn: 'root',
})
export class KitchenStatusService implements OnDestroy {
  private readonly now = signal(new Date());
  private readonly intervalId = setInterval(
    () => this.now.set(new Date()),
    60_000,
  );

  readonly isOpen = computed(() => isKitchenOpen(this.now()));

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
