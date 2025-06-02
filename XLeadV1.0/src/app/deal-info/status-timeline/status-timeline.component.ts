import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
 
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
 
  isMobile: boolean = false;
 
  constructor() {
    this.checkScreenSize();
  }
 
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }
 
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
 
  onStageClick(stage: string) {
    this.stageChange.emit(stage);
  }
 
  getCurrentStageIndex(): number {
    return this.stages.indexOf(this.currentStage);
  }
 
  isStageCompleted(index: number): boolean {
    const currentIndex = this.getCurrentStageIndex();
   
    // For Closed Won, show all previous stages (except Closed Lost) as completed
    if (this.currentStage === 'Closed Won') {
      return index < 4;
    }
   
    // For Closed Lost, show stages up to Negotiation as completed
    if (this.currentStage === 'Closed Lost') {
      return index < 4;
    }
   
    return index < currentIndex;
  }
 
  isConnectorCompleted(index: number): boolean {
    // For Closed Won, show blue connectors up to Closed Won
    if (this.currentStage === 'Closed Won' && index < 4) {
      return true;
    }
   
    // For other stages, use normal completion logic
    return this.isStageCompleted(index);
  }
}