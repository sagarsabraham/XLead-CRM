import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = '';
  @Input() formData: any = {};
  @Input() fields: { dataField: string; label: string; type?: string; required?: boolean }[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  handleClose() {
    this.onClose.emit();
    this.resetForm();
  }

  handleSubmit() {
    const hasEmptyRequired = this.fields.some(
      field => field.required && !this.formData[field.dataField]
    );

    if (!hasEmptyRequired) {
      this.onSubmit.emit(this.formData);
      this.resetForm();
    }
  }

  resetForm() {
    this.fields.forEach(field => this.formData[field.dataField] = '');
  }

}
