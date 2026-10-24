import { Component, input, output } from '@angular/core';
import { QtyControlComponent } from '../../../menu/components/qty-control/qty-control.component';
import { DishImageComponent } from '../../../menu/components/dish-image/dish-image.component';
import { AddOnProduct } from '../../utils/pick-add-ons';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-add-ons',
  imports: [
    TranslocoPipe,
    PriceComponent,
    DishImageComponent,
    QtyControlComponent,
  ],
  templateUrl: './add-ons.component.html',
  styleUrls: ['./add-ons.component.css'],
})
export class AddOnsComponent {
  readonly products = input.required<AddOnProduct[]>();
  readonly add = output<AddOnProduct>();
}
