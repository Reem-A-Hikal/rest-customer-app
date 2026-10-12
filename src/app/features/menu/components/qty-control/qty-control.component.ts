import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-qty-control',
  templateUrl: './qty-control.component.html',
  styleUrls: ['./qty-control.component.css'],
})
export class QtyControlComponent {
  @Input({ required: true }) quantity = 0;
  @Output() add = new EventEmitter<void>();
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
}
