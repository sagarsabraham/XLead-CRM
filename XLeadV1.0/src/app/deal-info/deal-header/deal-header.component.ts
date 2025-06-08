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
 
  formatDate(date: any): string {
    if (!date) return '';
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  }
}