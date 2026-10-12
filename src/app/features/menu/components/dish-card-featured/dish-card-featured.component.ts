import { Component, Input } from '@angular/core';
import { QtyControlComponent } from '../qty-control/qty-control.component';
import { CommonModule } from '@angular/common';
import { DishImageComponent } from '../dish-image/dish-image.component';
import { BaseDishCardComponent } from '../base-dish-card/base-dish-card.component';

@Component({
  selector: 'app-dish-card-featured',
  imports: [
    QtyControlComponent,
    CommonModule,
    DishImageComponent,
    DishImageComponent,
  ],
  templateUrl: './dish-card-featured.component.html',
  styleUrls: ['./dish-card-featured.component.css'],
})
export class DishCardFeaturedComponent extends BaseDishCardComponent {
  @Input({ required: true }) isSingle = true;
}
