import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-kitchen-section',
  imports: [TranslocoPipe],
  templateUrl: './kitchen-section.component.html',
  styleUrls: ['./kitchen-section.component.css'],
})
export class KitchenSectionComponent {}
