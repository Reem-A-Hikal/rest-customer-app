import { Component, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-order-notes',
  imports: [TranslocoPipe],
  templateUrl: './order-notes.component.html',
  styleUrls: ['./order-notes.component.css'],
})
export class OrderNotesComponent {
  readonly maxLength = 140;
  readonly value = model('');

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
  }
}
