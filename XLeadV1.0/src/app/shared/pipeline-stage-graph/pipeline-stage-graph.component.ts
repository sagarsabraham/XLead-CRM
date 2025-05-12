import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pipeline-stage-graph',
  templateUrl: './pipeline-stage-graph.component.html',
  styleUrls: ['./pipeline-stage-graph.component.css']
})
export class PipelineStageGraphComponent implements OnChanges {
  @Input() stages: { stage: string, amount: number }[] = [];

  filteredStages: { stage: string, amount: number }[] = [];
  valueAxisRange: { startValue: number, endValue: number } = { startValue: 0, endValue: 0 };
  tickInterval: number = 100000; 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stages']) {
      this.filteredStages = this.stages.filter(stage => stage.amount > 0);
      console.log('Filtered Stages:', this.filteredStages);
      const maxAmount = Math.max(...this.filteredStages.map(stage => stage.amount), 0);
      const buffer = maxAmount * 0.1; 
      this.valueAxisRange = { startValue: 0, endValue: maxAmount + buffer };

      
      this.setTickInterval(maxAmount);
    }
  }

 
  setTickInterval(maxAmount: number): void {
    if (maxAmount <= 100000) {
      this.tickInterval = 20000; 
    } else if (maxAmount <= 500000) {
      this.tickInterval = 100000;
    } else {
      this.tickInterval = 200000; 
    }
  }

  
  customizeTooltip(arg: any) {
    return {
      text: `${arg.argument}: ₹${arg.value.toLocaleString('en-IN')}`
    };
  }

  customizeValueAxisText(arg: any) {
    return `₹${arg.value.toLocaleString('en-IN')}`;
  }

  // onChartDrawn(event: any): void {
  //   console.log('Chart Drawn:', event);
  //   console.log('Chart Data Source:', event.component.getDataSource());
  // }
}