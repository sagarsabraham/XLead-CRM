// revenue-chart.component.ts
import { Component, Input, OnInit } from '@angular/core';
// DxChartComponent is not directly used here for type, so not strictly needed unless for @ViewChild
// import { DxChartComponent } from 'devextreme-angular'; 

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.css']
})
export class RevenueChartComponent { // Removed OnInit as it wasn't used
  @Input() revenueData: { month: string, amount: number }[] = []; // Changed type to match what dashboard-page provides

  customizeTooltip(pointInfo: any) {
    // Format for USD ($)
    const formattedValue = pointInfo.value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0  
    });
    return {
      
      text: `Revenue<br/>${pointInfo.argumentText}: ${formattedValue}`
    };
  }

  
}