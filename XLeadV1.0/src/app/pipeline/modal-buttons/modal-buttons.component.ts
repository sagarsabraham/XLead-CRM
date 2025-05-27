import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-buttons',
  templateUrl: './modal-buttons.component.html',
  styleUrls: ['./modal-buttons.component.css']
})
export class ModalButtonsComponent {
  @Input() customize:string='';
  @Input() showCustomize: boolean = false;
  @Input() cancelText: string = 'Cancel';
  @Input() saveText: string = 'Save';
  @Input() isSaveDisabled: boolean = false;

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();
  @Output() onCustomize = new EventEmitter<void>();

  handleCancel() {
    this.onCancel.emit();
  }
  handleSave() {
    this.onSave.emit();
  }
  handleCustomize() {
    this.onCustomize.emit(); // Emit the customize event
  }
}


