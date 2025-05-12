import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dealcard',
  templateUrl: './dealcard.component.html',
  styleUrls: ['./dealcard.component.css']
})
export class DealcardComponent {
  @Input() deal: any;
  hover = false;
}
