import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
interface Review {
  readonly quote: string;
  readonly author: string;
}
@Component({
  selector: 'app-reviews-section',
  imports: [TranslocoPipe],
  templateUrl: './reviews-section.component.html',
  styleUrls: ['./reviews-section.component.css'],
})
export class ReviewsSectionComponent {
  protected readonly reviews = [
    {
      quoteKey: 'home.reviews.items.t1.quote',
      authorKey: 'home.reviews.items.t1.author',
    },
    {
      quoteKey: 'home.reviews.items.t2.quote',
      authorKey: 'home.reviews.items.t2.author',
    },
    {
      quoteKey: 'home.reviews.items.t3.quote',
      authorKey: 'home.reviews.items.t3.author',
    },
  ];
}
