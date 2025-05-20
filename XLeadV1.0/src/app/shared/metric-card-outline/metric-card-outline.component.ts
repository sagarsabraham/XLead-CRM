import { Component } from '@angular/core';
import { DxResponsiveBoxModule } from 'devextreme-angular'; 


@Component({
  selector: 'app-metric-card-outline',
  templateUrl: './metric-card-outline.component.html',
  styleUrls: ['./metric-card-outline.component.css'],
  
})
export class MetricCardOutlineComponent {
  cards = [
    { title: 'Open Pipelines - This Month', value: '0', percentage: 100, isPositive: false },
    { title: 'Pipeline Won - This Month', value: '2', percentage: 100, isPositive: true },
    { title: 'Pipeline Lost - This Month', value: '1', percentage: 100, isPositive: false },
    { title: 'Revenue Won - This Month', value: '$5000.00', percentage: 100, isPositive: true }
  ];
}

