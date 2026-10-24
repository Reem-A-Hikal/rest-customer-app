import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-price',
  imports: [DecimalPipe, TranslocoPipe],
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css'],
})
export class PriceComponent  {
  readonly amount = input.required<number>();
  readonly format = input('1.0-2');
}
