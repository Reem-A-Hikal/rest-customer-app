import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlyToCartDirective } from '../../../../shared/directives/fly-to-cart.directive';

@Component({
  selector: 'app-qty-control',
  imports: [FlyToCartDirective],
  templateUrl: './qty-control.component.html',
  styleUrls: ['./qty-control.component.css'],
})
export class QtyControlComponent {
  @Input({ required: true }) quantity = 0;
  @Output() add = new EventEmitter<void>();
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
}
