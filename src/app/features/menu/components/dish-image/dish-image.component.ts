import { Component, Input } from '@angular/core';
import { toAssetUrl } from '../../../../shared/helpers/url.helper';
import { LocalizedNamePipe } from '../../../../core/i18n/localized';

export interface DishImageSource {
  name: string;
  imageUrl?: string | null;
  isPromoted?: boolean;
}

@Component({
  selector: 'app-dish-image',
  imports: [LocalizedNamePipe],
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
