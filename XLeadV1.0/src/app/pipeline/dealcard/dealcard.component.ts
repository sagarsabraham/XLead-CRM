import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dealcard',
  templateUrl: './dealcard.component.html',
  styleUrls: ['./dealcard.component.css']
})
export class DealcardComponent {
  @Input() deal: any;
  @Output() onEdit = new EventEmitter<any>(); // Emit event when edit icon is clicked
  hover = false;

  constructor(private router: Router) {}

  onCardClick() {
    const dealId = this.deal.title.replace(/\s+/g, '-').toLowerCase();
    this.router.navigate([`/dealinfo`], { state: { deal: this.deal } });
  }

  onEditClick(event: Event) {
    event.stopPropagation(); // Stop the card click from triggering
    this.onEdit.emit(this.deal); // Emit the deal to edit
  }
}