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
  @Input() stageId?: number;
  @Output() collapse = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<{ label: string, stageId?: number }>();
 
  onCollapse() {
    this.collapse.emit();
  }
 
  onButtonClick(label: string) {
    this.buttonClick.emit({ label, stageId: this.stageId });
  }
}
 