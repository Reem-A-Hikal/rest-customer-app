import { Component } from '@angular/core';
import { AppHeaderComponent } from '../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { KitchenSectionComponent } from './components/kitchen-section/kitchen-section.component';
import { HowItWorksSectionComponent } from './components/how-it-works-section/how-it-works-section.component';
import { MenuCtaSectionComponent } from './components/menu-cta-section/menu-cta-section.component';
import { StandardsSectionComponent } from './components/standards-section/standards-section.component';
import { ReviewsSectionComponent } from './components/reviews-section/reviews-section.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    AppHeaderComponent,
    HeroSectionComponent,
    KitchenSectionComponent,
    HowItWorksSectionComponent,
    MenuCtaSectionComponent,
    StandardsSectionComponent,
    ReviewsSectionComponent,
    TranslocoPipe
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
