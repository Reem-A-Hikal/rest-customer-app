import { Component } from '@angular/core';
interface Standard {
  readonly title: string;
  readonly description: string;
}
@Component({
  selector: 'app-standards-section',
  templateUrl: './standards-section.component.html',
  styleUrls: ['./standards-section.component.css'],
})
export class StandardsSectionComponent {
  readonly quote = {
    text: 'I never plated a dish for someone I couldn’t see. Now every plate has to speak for itself.',
    author: 'Youssef Naguib',
    role: 'Head Chef',
  } as const;

  readonly standards: readonly Standard[] = [
    {
      title: 'Sourcing',
      description:
        'Produce and meat sourced daily from a small circle of Delta-region farms.',
    },
    {
      title: 'Hygiene',
      description:
        'HACCP-certified kitchen with daily audits, not annual ones.',
    },
    {
      title: 'Packaging',
      description:
        'Leak-tested, compostable containers, sealed course by course.',
    },
    {
      title: 'Consistency',
      description:
        'Every plate finished by the chef on duty — never assembled by a courier.',
    },
  ];
}
