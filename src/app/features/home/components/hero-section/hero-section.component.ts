import { Component, inject } from '@angular/core';
import { KitchenStatusService } from '../../../../core/services/kitchen-status.service';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
})
export class HeroSectionComponent {
  private readonly kitchenStatus = inject(KitchenStatusService);
  protected readonly kitchenOpen = this.kitchenStatus.isOpen;
}
