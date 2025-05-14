import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card-outline',
  templateUrl: './metric-card-outline.component.html',
  styleUrls: ['./metric-card-outline.component.css']
})
export class MetricCardOutlineComponent {
  @Input() cards: { title?: string, value: string | number, percentage: number, isPositive: boolean }[] = [
    { title: 'Open Pipelines - This Month', value: 120, percentage: 5, isPositive: true },
    { title: 'Pipelines Won - This Month', value: 80, percentage: 8, isPositive: true },
    { title: 'Pipelines Lost - This Month', value: 40, percentage: -3, isPositive: false },
    { title: 'Revenue Won - This Month', value: 200000, percentage: 12, isPositive: true }
  ];

  @Input() labels: string[] = [
    'Open Pipelines - This Month',
    'Pipelines Won - This Month',
    'Pipelines Lost - This Month',
    'Revenue Won - This Month'
  ];
}
