import { Component, Input } from '@angular/core';
import { QtyControlComponent } from '../qty-control/qty-control.component';
import { CommonModule } from '@angular/common';
import { DishImageComponent } from '../dish-image/dish-image.component';
import { BaseDishCardComponent } from '../base-dish-card/base-dish-card.component';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  LocalizedDescriptionPipe,
  LocalizedNamePipe,
} from '../../../../core/i18n/localized';

@Component({
  selector: 'app-dish-card-featured',
  imports: [
    QtyControlComponent,
    CommonModule,
    DishImageComponent,
    DishImageComponent,
    TranslocoPipe,
    LocalizedDescriptionPipe,
    LocalizedNamePipe,
  ],
  templateUrl: './dish-card-featured.component.html',
  styleUrls: ['./dish-card-featured.component.css'],
})
export class DishCardFeaturedComponent extends BaseDishCardComponent {
  @Input({ required: true }) isSingle = true;
}
