import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-deal-info-card',
  templateUrl: './deal-info-card.component.html',
  styleUrls: ['./deal-info-card.component.css']
})
export class DealInfoCardComponent {

  @Input() deal: any;
  @Output() descriptionChange = new EventEmitter<string>();
  
  get contactItems() {
    if (!this.deal) return [];
    return [
      { icon: 'user', text: this.deal.contactName || 'N/A', isLink: false },
      { icon: 'email', text: this.deal.contactEmail || 'N/A', isLink: true },
      { icon: 'tel', text: this.deal.contactPhone || 'N/A', isPhone: true }
    ];
  }

  get companyItems() {
    if (!this.deal) return [];
    return [
      { icon: 'home', text: this.deal.companyName || 'N/A', isLink: false },
      { icon: 'globe', text: this.deal.companyWebsite ? this.deal.companyWebsite.replace('info@', '').replace('.com', '') + '.com' : 'N/A', isLink: true },
      { icon: 'tel', text: this.deal.companyPhone || 'N/A', isPhone: true }
    ];
  }

  get dealDescription() {
    return this.deal?.description || 'No description available.';
  }

  onDescriptionChange(newDescription: string) {
    this.descriptionChange.emit(newDescription);
  }
}
