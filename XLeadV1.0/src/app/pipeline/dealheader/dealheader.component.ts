import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dealheader',
  imports: [CommonModule],
  templateUrl: './dealheader.component.html',
  styleUrl: './dealheader.component.css'
})
export class DealheaderComponent {
  @Input() stageName: string = '';
  @Input() amount: string = '';
  @Input() dealCount: number = 0;
  @Input() collapsed = false;
}