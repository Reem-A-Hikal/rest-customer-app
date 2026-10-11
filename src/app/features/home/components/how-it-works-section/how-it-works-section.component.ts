import { Component } from '@angular/core';
interface Step {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-how-it-works-section',
  templateUrl: './how-it-works-section.component.html',
  styleUrls: ['./how-it-works-section.component.css'],
})
export class HowItWorksSectionComponent {
  readonly steps: readonly Step[] = [
    {
      title: 'Choose your evening',
      description:
        "Browse tonight's menu, set fresh each day, and order any time before 9pm.",
    },
    {
      title: 'Plated to order',
      description:
        "Nothing sits pre-made. Your dish is cooked and finished the moment it's placed.",
    },
    {
      title: 'Arrives dining-ready',
      description:
        'Sealed in insulated, course-separated packaging so it reaches you as the chef meant it.',
    },
  ];
}
