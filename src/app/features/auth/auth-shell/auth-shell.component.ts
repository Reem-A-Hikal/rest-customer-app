import { Component, input } from '@angular/core';
import { AppHeaderComponent } from '../../../shared/components/header/header.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-auth-shell',
  imports: [AppHeaderComponent, TranslocoPipe],
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.css'],
})
export class AuthShellComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
}
