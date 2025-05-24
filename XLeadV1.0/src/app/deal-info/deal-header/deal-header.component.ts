import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deal-header',
  templateUrl: './deal-header.component.html',
  styleUrls: ['./deal-header.component.css']
})
export class DealHeaderComponent {
  @Input() deal: any;

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/pipeline']);
  }

}
