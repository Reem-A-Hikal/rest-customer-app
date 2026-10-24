import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
interface Step {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-how-it-works-section',
  imports: [TranslocoPipe],
  templateUrl: './how-it-works-section.component.html',
  styleUrls: ['./how-it-works-section.component.css'],
})
export class HowItWorksSectionComponent {
  protected readonly steps = [
    {
      titleKey: 'home.howItWorks.steps.choose.title',
      descriptionKey: 'home.howItWorks.steps.choose.description',
    },
    {
      titleKey: 'home.howItWorks.steps.plated.title',
      descriptionKey: 'home.howItWorks.steps.plated.description',
    },
    {
      titleKey: 'home.howItWorks.steps.arrives.title',
      descriptionKey: 'home.howItWorks.steps.arrives.description',
    },
  ];
}
