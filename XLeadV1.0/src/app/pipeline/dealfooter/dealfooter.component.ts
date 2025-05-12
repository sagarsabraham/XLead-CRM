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

  onCollapse() {
    this.collapse.emit();
  }

  onButtonClick(label: string) {
    console.log(`Button clicked: ${label}`);
  }
}
