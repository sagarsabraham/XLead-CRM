import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dealfooter',
  imports: [MatIconModule, MatButtonModule, ExportComponent],
  templateUrl: './dealfooter.component.html',
  styleUrl: './dealfooter.component.css'
})
export class DealfooterComponent {
  @Output() collapse = new EventEmitter<void>();

  onCollapse() {
    this.collapse.emit();
  }
}

  onAddDeal() {
    console.log('Add Deal clicked');
  }
}