import { Component } from '@angular/core';

@Component({
  selector: 'app-deal-info-card',
  templateUrl: './deal-info-card.component.html',
  styleUrls: ['./deal-info-card.component.css']
})
export class DealInfoCardComponent {
  contactItems = [
    { icon: 'user', text: 'Ted Watson', isLink: false },
    { icon: 'email', text: 'tedwatson@gmail.com', isLink: true },
    { icon: 'tel', text: '+1 5643523447', isPhone: true }
  ];

  companyItems = [
    { icon: 'home', text: 'Bayoda', isLink: false },
    { icon: 'globe', text: 'Bayoda.com', isLink: true },
    { icon: 'tel', text: '+1 23456789', isPhone: true }
  ];

  dealDescription = 'This deal description represents the details given by a Salesperson about the deal as a preview.';
}
