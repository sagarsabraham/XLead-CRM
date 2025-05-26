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
  @Input() fields: { dataField: string; label: string; type?: string; required?: boolean; editorType?: string; editorOptions?: any; }[] = [];


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
    this.fields.forEach(field => {
      if (field.editorType === 'dxSelectBox' && field.editorOptions?.items) {
        // Default to the first item in the dropdown if available
        this.formData[field.dataField] = field.editorOptions.items[0] || '';
      } else {
        this.formData[field.dataField] = '';
      }
    });
  }
}
