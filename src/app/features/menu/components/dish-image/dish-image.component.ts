import { Component, Input } from '@angular/core';
import { toAssetUrl } from '../../../../shared/helpers/url.helper';

export interface DishImageSource {
  name: string;
  imageUrl?: string | null;
  isPromoted?: boolean;
}

@Component({
  selector: 'app-dish-image',
  templateUrl: './dish-image.component.html',
  styleUrls: ['./dish-image.component.css'],
})
export class DishImageComponent {
  @Input({ required: true }) product!: DishImageSource;
  protected imageFailed = false;
  toAssetUrl = toAssetUrl;
  protected onImageError(): void {
    this.imageFailed = true;
  }
}
