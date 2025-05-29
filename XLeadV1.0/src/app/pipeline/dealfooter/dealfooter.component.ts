import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dealfooter',
  templateUrl: './dealfooter.component.html',
  styleUrls: ['./dealfooter.component.css']
})
export class DealfooterComponent {
  @Input() buttons: { 
    label: string, 
    icon: string
  }[] = [];
  @Output() collapse = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<string>(); // Add this line

  onCollapse() {
    this.collapse.emit();
  }

  onButtonClick(label: string) {
    this.buttonClick.emit(label); // Modify this to emit the event
  }
}