import { Component, Input } from '@angular/core';
 
@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css']
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: string = '0';
  @Input() percentage: number = 0;
  @Input() isPositive: boolean = true;
}