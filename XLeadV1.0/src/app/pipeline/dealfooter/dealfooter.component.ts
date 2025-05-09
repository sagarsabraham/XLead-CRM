import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dealfooter',
  templateUrl: './dealfooter.component.html',
  styleUrls: ['./dealfooter.component.css']
})
export class DealfooterComponent {
  @Output() collapse = new EventEmitter<void>();

  onCollapse() {
    this.collapse.emit();
  }
}
