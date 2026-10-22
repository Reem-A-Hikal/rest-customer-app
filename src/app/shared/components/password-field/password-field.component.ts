import { Component, input, signal } from '@angular/core';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideEye, LucideEyeOff } from '@lucide/angular';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-password-field',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    LucideEye,
    LucideEyeOff,
    TranslocoPipe,
  ],
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.css'],
})
export class PasswordFieldComponent {
  readonly control = input.required<FormControl<string>>();
  readonly inputId = input.required<string>();
  readonly label = input('auth.fields.password');
  readonly error = input<string | null>(null);
  readonly autocomplete = input('current-password');

  protected readonly visible = signal(false);
}
