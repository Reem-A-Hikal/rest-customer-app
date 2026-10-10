import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-center gap-2xs' },
  templateUrl: './brand-logo.component.html',
})
export class BrandLogoComponent {
  constructor() {}
}
