import { Component } from '@angular/core';
import { DxResponsiveBoxModule } from 'devextreme-angular'; 


@Component({
  selector: 'app-metric-card-outline',
  templateUrl: './metric-card-outline.component.html',
  styleUrls: ['./metric-card-outline.component.css'],
  
})
export class MetricCardOutlineComponent {
  cards = [
    { title: 'Open Pipelines - This Month', value: '31', percentage: 54, isPositive: false },
    { title: 'Pipeline Won - This Month', value: '8', percentage: 67, isPositive: true },
    { title: 'Pipeline Lost - This Month', value: '3', percentage: 12, isPositive: false },
    { title: 'Revenue Won - This Month', value: '$12750.00', percentage: 29, isPositive: true }
  ];
}