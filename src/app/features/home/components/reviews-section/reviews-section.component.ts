import { Component } from '@angular/core';
interface Review {
  readonly quote: string;
  readonly author: string;
}
@Component({
  selector: 'app-reviews-section',
  templateUrl: './reviews-section.component.html',
  styleUrls: ['./reviews-section.component.css'],
})
export class ReviewsSectionComponent {
  readonly reviews: readonly Review[] = [
    {
      quote:
        'Every course arrived exactly when the last one finished, like they knew our pace before we did.',
      author: 'Nourhan, Maadi',
    },
    {
      quote:
        "I stopped telling people it's delivery. It just doesn't taste like delivery.",
      author: 'Omar, Zamalek',
    },
    {
      quote:
        'The lamb shoulder shows up at our table more reliably than most of our dinner guests.',
      author: 'Salma, New Cairo',
    },
  ];
}
