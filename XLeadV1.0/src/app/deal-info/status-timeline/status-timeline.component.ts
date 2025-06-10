import { Component, EventEmitter, Input, Output, HostListener, ChangeDetectorRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
 
@Component({
  selector: 'app-status-timeline',
  templateUrl: './status-timeline.component.html',
  styleUrls: ['./status-timeline.component.css']
})
export class StatusTimelineComponent implements OnChanges, OnInit {
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
  private isInitialized: boolean = false;
 
  constructor(private cdr: ChangeDetectorRef) {
    this.checkScreenSize();
  }
 
  ngOnInit(): void {
    this.isInitialized = true;
    // Force initial detection
    setTimeout(() => {
      console.log('Initial stage on load:', this.currentStage);
      this.cdr.detectChanges();
    }, 0);
  }
 
ngOnChanges(changes: SimpleChanges): void {
  if (changes['currentStage'] && changes['currentStage'].currentValue) {
    const normalized = this.normalizeStage(changes['currentStage'].currentValue);
    this.currentStage = normalized;
    console.log('Normalized stage in ngOnChanges:', normalized);
  }
}

 
  private normalizeStage(stage: string): string {
    if (!stage) return 'Qualification'; // Default stage
   
    // Handle different possible stage name formats
    const stageMap: { [key: string]: string } = {
      'qualification': 'Qualification',
      'need analysis': 'Need Analysis',
      'needanalysis': 'Need Analysis',
      'proposal': 'Proposal/Price Quote',
      'proposal/price quote': 'Proposal/Price Quote',
      'proposalpricequote': 'Proposal/Price Quote',
      'negotiation': 'Negotiation/Review',
      'negotiation/review': 'Negotiation/Review',
      'negotiationreview': 'Negotiation/Review',
      'closed won': 'Closed Won',
      'closedwon': 'Closed Won',
      'closed lost': 'Closed Lost',
      'closedlost': 'Closed Lost'
    };
   
    const normalizedInput = stage.toLowerCase().trim();
   
    // Check if we have a mapping
    for (const [key, value] of Object.entries(stageMap)) {
      if (normalizedInput === key || normalizedInput.includes(key)) {
        return value;
      }
    }
   
    // Check if the stage matches any of our stages (case-insensitive)
    const matchedStage = this.stages.find(s =>
      s.toLowerCase() === normalizedInput
    );
   
    return matchedStage || stage; // Return original if no match found
  }
 
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }
 
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
 
  onStageClick(stage: string) {
    if (stage !== this.currentStage) {
      console.log('Emitting stage change:', stage);
      this.stageChange.emit(stage);
    }
  }
 
  getCurrentStageIndex(): number {
    const index = this.stages.findIndex(s => s === this.currentStage);
    return index >= 0 ? index : 0; // Default to first stage if not found
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
 