import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
interface Standard {
  readonly title: string;
  readonly description: string;
}
@Component({
  selector: 'app-standards-section',
  imports: [TranslocoPipe],
  templateUrl: './standards-section.component.html',
  styleUrls: ['./standards-section.component.css'],
})
export class StandardsSectionComponent {
  // readonly quote = {
  //   text: 'I never plated a dish for someone I couldn’t see. Now every plate has to speak for itself.',
  //   author: 'Youssef Naguib',
  //   role: 'Head Chef',
  // } as const;

  protected readonly standards = [
    {
      titleKey: 'home.standards.items.sourcing.title',
      descriptionKey: 'home.standards.items.sourcing.description',
    },
    {
      titleKey: 'home.standards.items.hygiene.title',
      descriptionKey: 'home.standards.items.hygiene.description',
    },
    {
      titleKey: 'home.standards.items.packaging.title',
      descriptionKey: 'home.standards.items.packaging.description',
    },
    {
      titleKey: 'home.standards.items.consistency.title',
      descriptionKey: 'home.standards.items.consistency.description',
    },
  ];
}
