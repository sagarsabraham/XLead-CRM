import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-status-timeline',
  templateUrl: './status-timeline.component.html',
  styleUrls: ['./status-timeline.component.css']
})
export class StatusTimelineComponent {
  @Input() currentStage: string = '';
  @Output() stageChange = new EventEmitter<string>();

  stages: string[] = [
    'Qualification',
    'Need Analysis',
    'Negotiation',
    'Proposal',
    'Closed Won',
    'Closed Lost'
  ];

  onStageClick(stage: string) {
    this.currentStage = stage; // optional: visually reflect change inside component too
    this.stageChange.emit(stage);
  }
}
