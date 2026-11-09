import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlyToCartDirective } from '../../../../shared/directives/fly-to-cart.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { MAX_QUANTITY_PER_ITEM } from '../../../../shared/constants/cart.constants';

@Component({
  selector: 'app-qty-control',
  imports: [FlyToCartDirective, TranslocoPipe],
  templateUrl: './qty-control.component.html',
  styleUrls: ['./qty-control.component.css'],
})
export class QtyControlComponent {
  @Input({ required: true }) quantity = 0;
  @Input() name = '';
  @Input() max = MAX_QUANTITY_PER_ITEM;
  @Output() add = new EventEmitter<void>();
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();

  protected get atMax(): boolean {
    return this.quantity >= this.max;
  }
}
