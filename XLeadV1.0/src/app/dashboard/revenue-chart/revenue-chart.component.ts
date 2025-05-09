import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxChartComponent } from 'devextreme-angular';

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.css']
})
export class RevenueChartComponent {
  @Input() revenueData: { [key: string]: any }[] = [];

  customizeTooltip(pointInfo: any) {
    return {
      text: `Sum of Amount<br/>${pointInfo.argumentText} : ₹${pointInfo.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    };
  }
}
