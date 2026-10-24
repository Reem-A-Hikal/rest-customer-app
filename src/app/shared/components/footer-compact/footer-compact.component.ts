import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-footer-compact',
  imports: [TranslocoPipe],
  templateUrl: './footer-compact.component.html',
  styleUrls: ['./footer-compact.component.css'],
})
export class FooterCompactComponent {}
