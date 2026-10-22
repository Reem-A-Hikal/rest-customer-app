import { computed, inject, Injectable, signal } from '@angular/core';
import { Address, AddressCreateRequest } from '../model/address.model';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { finalize, Observable, tap, throwError } from 'rxjs';

interface AddressState {
  userId: string;
  items: Address[];
  selectedId: number | null;
}
@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  private readonly state = signal<AddressState | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  private readonly current = computed(() => {
    const state = this.state();
    return state?.userId === this.auth.user()?.id ? state : null;
  });

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly addresses = computed(() => this.current()?.items ?? []);

  readonly selectedAddress = computed(() => {
    const state = this.current();
    if (!state) return null;

    return (
      state.items.find((a) => a.addressId === state?.selectedId) ??
      state.items.find((a) => a.isDefault) ??
      state.items[0] ??
      null
    );
  });

  load(): void {
    const user = this.auth.user();
    if (!user || this.loadingSignal()) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api
      .get<Address[]>(`/Address/user/${user.id}`)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (items) =>
          this.state.update((prev) => ({
            userId: user.id,
            items,
            selectedId: prev?.userId === user.id ? prev.selectedId : null,
          })),
        error: () => this.errorSignal.set('Failed to load your addresses.'),
      });
  }

  create(request: AddressCreateRequest): Observable<Address> {
    const user = this.auth.user();
    if (!user) return throwError(() => new Error('Not signed in'));

    return this.api.post<Address>(`/Address/user/${user.id}`, request).pipe(
      tap((created) =>
        this.state.update((prev) => ({
          userId: user.id,
          items: [...(prev?.userId === user.id ? prev.items : []), created],
          selectedId: created.addressId,
        })),
      ),
    );
  }

  select(addressId: number): void {
    this.state.update((prev) =>
      prev ? { ...prev, selectedId: addressId } : prev,
    );
  }
}
