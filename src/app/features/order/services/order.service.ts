import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { CreateOrderRequest, PlacedOrder } from '../models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly api = inject(ApiService);
  create(request: CreateOrderRequest): Observable<PlacedOrder> {
    return this.api.post<PlacedOrder>('/Order', request);
  }
}
