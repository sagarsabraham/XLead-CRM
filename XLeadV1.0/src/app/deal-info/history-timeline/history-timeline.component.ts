import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-history-timeline',
  templateUrl: './history-timeline.component.html',
  styleUrls: ['./history-timeline.component.css']
})
export class HistoryTimelineComponent {
  @Input() history: { timestamp: string; editedBy: string; fromStage: string; toStage: string }[] = [];
}
