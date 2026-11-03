import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AREA_LABEL_KEYS } from '../constants/delivery-area';
import { finalize } from 'rxjs';

interface DeliveryZone {
  governorate: string;
  areas: string[];
}
@Injectable({
  providedIn: 'root',
})
export class DeliveryZoneService {
  private readonly api = inject(ApiService);

  private readonly zone = signal<DeliveryZone | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal(false);

  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly governorate = computed(() => this.zone()?.governorate ?? null);

  readonly areas = computed(() =>
    (this.zone()?.areas ?? []).map((value) => ({
      value,
      labelKey: AREA_LABEL_KEYS.get(value) ?? null,
    })),
  );

  load(): void {
    if (this.zone() || this.loadingState()) return;

    this.loadingState.set(true);
    this.errorState.set(false);

    this.api
      .get<DeliveryZone>('/DeliveryZone')
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: (zone) => this.zone.set(zone),
        error: () => this.errorState.set(true),
      });
  }
}
