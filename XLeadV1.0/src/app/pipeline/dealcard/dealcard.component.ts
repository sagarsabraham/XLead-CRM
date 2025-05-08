import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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