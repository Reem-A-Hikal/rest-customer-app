import { Component, model } from '@angular/core';

@Component({
  selector: 'app-order-notes',
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
