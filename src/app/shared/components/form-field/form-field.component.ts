import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-form-field',
  imports: [TranslocoPipe],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.css'],
})
export class FormFieldComponent {
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();
  readonly error = input<string | null>(null);
  readonly optional = input(false);
}
