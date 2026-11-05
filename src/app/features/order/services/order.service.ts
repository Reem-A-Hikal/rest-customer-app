import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { CreateOrderRequest, Order, PlacedOrder } from '../models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly api = inject(ApiService);

  create(request: CreateOrderRequest): Observable<PlacedOrder> {
    return this.api.post<PlacedOrder>('/Order', request);
  }

  myOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('/Order/my-orders');
  }

  cancel(orderId: number, reason: string): Observable<Order> {
    return this.api.patch<Order>(`/Order/${orderId}/cancel`, {
      cancellationReason: reason,
    });
  }
}
