import { Component, input, output } from '@angular/core';
import { QtyControlComponent } from '../../../menu/components/qty-control/qty-control.component';
import { DishImageComponent } from '../../../menu/components/dish-image/dish-image.component';
import { DecimalPipe } from '@angular/common';
import { AddOnProduct } from '../../utils/pick-add-ons';

@Component({
  selector: 'app-add-ons',
  imports: [DecimalPipe, DishImageComponent, QtyControlComponent],
  templateUrl: './add-ons.component.html',
  styleUrls: ['./add-ons.component.css'],
})
export class AddOnsComponent {
  readonly products = input.required<AddOnProduct[]>();
  readonly add = output<AddOnProduct>();
}
