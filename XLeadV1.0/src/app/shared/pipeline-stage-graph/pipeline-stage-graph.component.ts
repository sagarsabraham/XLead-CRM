import { Component, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { DxChartModule, DxScrollViewModule } from 'devextreme-angular';
 
@Component({
  selector: 'app-pipeline-stage-graph',
  templateUrl: './pipeline-stage-graph.component.html',
  styleUrls: ['./pipeline-stage-graph.component.css']
})
export class PipelineStageGraphComponent implements OnChanges {
  @Input() stages: { stage: string, amount: number }[] = [];
 
  filteredStages: { stage: string, amount: number }[] = [];
  valueAxisRange: { startValue: number, endValue: number } = { startValue: 0, endValue: 0 };
  // tickInterval: number = 100000;
  chartSize: { height: number } = { height: 349 };
  adaptiveLayoutWidth: number = 300;
  isMobile: boolean = false;
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stages']) {
      this.filteredStages = this.stages.filter(stage => stage.amount > 0);
      const maxAmount = Math.max(...this.filteredStages.map(stage => stage.amount), 0);
      const buffer = maxAmount * 0.1;
      this.valueAxisRange = { startValue: 0, endValue: maxAmount + buffer };
      // this.setTickInterval(maxAmount);
    }
  }
 
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateChartSize();
  }
 
  ngOnInit(): void {
    this.updateChartSize();
  }
 
  updateChartSize(): void {
    const width = window.innerWidth;
    this.isMobile = width <= 480;
 
    if (width <= 480) {
      this.chartSize = { height: 250 };
      this.adaptiveLayoutWidth = 200;
    } else if (width <= 768) {
      this.chartSize = { height: 300 };
      this.adaptiveLayoutWidth = 250;
    } else {
      this.chartSize = { height: 320 };
      this.adaptiveLayoutWidth = 300;
    }
  }
 
  // setTickInterval(maxAmount: number): void {
  //   if (maxAmount <= 100000) {
  //     this.tickInterval = 20000;
  //   } else if (maxAmount <= 500000) {
  //     this.tickInterval = 100000;
  //   } else {
  //     this.tickInterval = 200000;
  //   }
  // }
 
  customizeTooltip(arg: any) {
  const formattedValue = arg.value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, // Optional: to display $123 instead of $123.00
    maximumFractionDigits: 0  // Optional: to display $123 instead of $123.00
  });
  return {
    text: `${arg.argument}: ${formattedValue}`
  };
}
   customizeValueAxisText(arg: any) {
    return arg.value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}