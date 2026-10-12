import { Component, Input } from '@angular/core';
import { Product } from '../../models/menu.model';
import { toAssetUrl } from '../../../../shared/helpers/url.helper';

@Component({
  selector: 'app-dish-image',
  templateUrl: './dish-image.component.html',
  styleUrls: ['./dish-image.component.css'],
})
export class DishImageComponent {
  @Input({ required: true }) product!: Product;
  protected imageFailed = false;
  toAssetUrl = toAssetUrl;
  protected onImageError(): void {
    this.imageFailed = true;
  }
}
