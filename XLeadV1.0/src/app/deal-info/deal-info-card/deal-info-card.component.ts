import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-deal-info-card',
  templateUrl: './deal-info-card.component.html',
  styleUrls: ['./deal-info-card.component.css']
})
export class DealInfoCardComponent {
  
  @Input() dealInfo: any;

  get contactItems() {
    return [
      { icon: 'user', text: this.dealInfo.contact_name, isLink: false },
      { icon: 'email', text: this.dealInfo.contact_email, isLink: true },
      { icon: 'tel', text: this.dealInfo.contact_phno, isPhone: true }
    ];
  }

  get companyItems() {
    return [
      { icon: 'home', text: this.dealInfo.company_name, isLink: false },
      { icon: 'globe', text: this.dealInfo.company_website, isLink: true },
      { icon: 'tel', text: this.dealInfo.company_phno, isPhone: true }
    ];
  }

  get dealDescription(): string {
    return this.dealInfo.description;
  }

  // contactItems = [
  //   { icon: 'user', text: 'Ted Watson', isLink: false },
  //   { icon: 'email', text: 'tedwatson@gmail.com', isLink: true },
  //   { icon: 'tel', text: '+1 5643523447', isPhone: true }
  // ];

  // companyItems = [
  //   { icon: 'home', text: 'Bayoda', isLink: false },
  //   { icon: 'globe', text: 'Bayoda.com', isLink: true },
  //   { icon: 'tel', text: '+1 23456789', isPhone: true }
  // ];

  // dealDescription = 'This deal description represents the details given by a Salesperson about the deal as a preview.';
  deal: any = null;

  onDescriptionChange(newDescription: string) {
     this.deal.description = newDescription;
  }
}
