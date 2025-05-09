import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dealcard',
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './dealcard.component.html',
  styleUrl: './dealcard.component.css'
})
export class DealcardComponent {
  @Input() deal: any;
  hover = false;
}