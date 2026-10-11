import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

interface FooterLink {
  readonly label: string;
  readonly route: string;
  readonly fragment?: string;
}
@Component({
  selector: 'app-footer',
  imports: [RouterLink, BrandLogoComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly exploreLinks: readonly FooterLink[] = [
    { label: 'The Kitchen', route: '/', fragment: 'kitchen' },
    { label: "Tonight's Menu", route: '/menu' },
    { label: 'How It Works', route: '/', fragment: 'how-it-works' },
    { label: 'Reviews', route: '/', fragment: 'reviews' },
  ];

  readonly hours: readonly string[] = [
    '6:00 PM – 12:00 AM daily',
    'Orders close at 9:00 PM',
    'Delivery only — no walk-ins',
  ];

  readonly email = new FormControl('', { nonNullable: true });
  readonly note = signal('');

  subscribe(event: Event): void {
    event.preventDefault();
    if (!this.email.value.trim()) return;
    this.note.set(
      "You're on the list — tomorrow's menu lands in your inbox before it's posted.",
    );
    this.email.reset();
  }
}
