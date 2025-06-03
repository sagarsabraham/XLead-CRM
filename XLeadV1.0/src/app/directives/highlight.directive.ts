import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {
  @Input() appHighlightDate: Date | string | undefined; // For closing date
  @Input() appHighlightProbability: number | string | undefined; // For probability

  private today: Date = new Date(); // Dynamically get the current date

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Default color
    this.el.nativeElement.style.color = '#666666';

    // Handle closing date
    if (this.appHighlightDate) {
      this.applyDateColor();
    }

    // Handle probability
    if (this.appHighlightProbability !== undefined && this.appHighlightProbability !== null) {
      this.applyProbabilityColor();
    }
  }

  private applyDateColor() {
    const closeDate = new Date(this.appHighlightDate!);
    if (isNaN(closeDate.getTime())) {
      console.warn('Invalid date provided to appHighlightDate:', this.appHighlightDate);
      return;
    }

    const timeDiff = closeDate.getTime() - this.today.getTime();
    const daysUntilClose = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysUntilClose <= 5 && daysUntilClose >= 0) {
      this.el.nativeElement.style.color = 'red'; 
    }
  }

  private applyProbabilityColor() {
    let probabilityStr = this.appHighlightProbability!.toString();
    probabilityStr = probabilityStr.replace('%', '');
    const probability = parseFloat(probabilityStr);
    if (isNaN(probability)) {
      console.warn('Invalid probability provided to appHighlightProbability:', this.appHighlightProbability);
      return;
    }

    // Make the text bold
    this.el.nativeElement.style.fontWeight = 'bold';

    if (probability < 45) {
      this.el.nativeElement.style.color = 'red';
    } else if (probability >= 45 && probability < 70) {
      this.el.nativeElement.style.color = 'black';
    } else if (probability >= 70) {
      this.el.nativeElement.style.color = '#22c55e';
    }
  }
}
