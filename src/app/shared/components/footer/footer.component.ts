import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';
import { TranslocoPipe } from '@jsverse/transloco';

interface FooterLink {
  readonly labelKey: string;
  readonly route: string;
  readonly fragment?: string;
}
@Component({
  selector: 'app-footer',
  imports: [RouterLink, BrandLogoComponent, TranslocoPipe],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  protected readonly githubUrl =
    'https://github.com/Reem-A-Hikal/rest-customer-app';
  protected readonly linkedinUrl = 'https://www.linkedin.com/in/reem-heikal';

  readonly exploreLinks: readonly FooterLink[] = [
    { labelKey: 'footer.links.kitchen', route: '/', fragment: 'kitchen' },
    { labelKey: 'footer.links.menu', route: '/menu' },
    {
      labelKey: 'footer.links.howItWorks',
      route: '/',
      fragment: 'how-it-works',
    },
    { labelKey: 'footer.links.reviews', route: '/', fragment: 'reviews' },
  ];

  protected readonly hours = [
    'footer.hours.open',
    'footer.hours.cutoff',
    'footer.hours.deliveryOnly',
  ];
}
