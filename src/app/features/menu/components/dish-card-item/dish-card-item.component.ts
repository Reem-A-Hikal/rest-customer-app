import { Component } from '@angular/core';
import { QtyControlComponent } from '../qty-control/qty-control.component';
import { CommonModule } from '@angular/common';
import { DishImageComponent } from '../dish-image/dish-image.component';
import { BaseDishCardComponent } from '../base-dish-card/base-dish-card.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-dish-card-item',
  imports: [
    QtyControlComponent,
    CommonModule,
    DishImageComponent,
    DishImageComponent,
    TranslocoPipe
  ],
  templateUrl: './dish-card-item.component.html',
  styleUrls: ['./dish-card-item.component.css'],
})
export class DishCardItemComponent extends BaseDishCardComponent {}
