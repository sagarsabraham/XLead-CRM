import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dealcard',
  templateUrl: './dealcard.component.html',
  styleUrls: ['./dealcard.component.css']
})
export class DealcardComponent {
  @Input() deal: any;
  hover = false;

  constructor(private router: Router) {}

  onCardClick() {
    const dealId = this.deal.title.replace(/\s+/g, '-').toLowerCase();
    this.router.navigate([`/dealinfo`], { state: { deal: this.deal } });
  }
}
