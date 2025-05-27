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
    'Proposal/Price Quote',
    'Negotiation/Review',
    'Closed Won',
    'Closed Lost'
  ];

  onStageClick(stage: string) {
    this.stageChange.emit(stage);
  }
}
