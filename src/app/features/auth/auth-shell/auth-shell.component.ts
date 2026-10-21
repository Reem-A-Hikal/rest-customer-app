import { Component, input } from '@angular/core';
import { AppHeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-auth-shell',
  imports: [AppHeaderComponent],
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.css'],
})
export class AuthShellComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
}
