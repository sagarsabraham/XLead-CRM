import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-deal-header',
  templateUrl: './deal-header.component.html',
  styleUrls: ['./deal-header.component.css']
})
export class DealHeaderComponent {
  @Input() deal: any;

}
