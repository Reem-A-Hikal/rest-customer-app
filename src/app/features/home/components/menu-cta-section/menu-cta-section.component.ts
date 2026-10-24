import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-menu-cta-section',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './menu-cta-section.component.html',
  styleUrls: ['./menu-cta-section.component.css'],
})
export class MenuCtaSectionComponent {}
