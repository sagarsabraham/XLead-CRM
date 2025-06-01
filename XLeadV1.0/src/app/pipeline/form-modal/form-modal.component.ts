import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
export interface DxValidationRule {
  type: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email';
  message: string;
  min?: number | Date;
  max?: number | Date;
  pattern?: string | RegExp;
  comparisonTarget?: () => any;
  comparisonType?: string;
  validationCallback?: (options: { value: any; rule: DxValidationRule; data: any; }) => boolean;
  // ... other rule-specific properties
}
@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = '';
  @Input() formData: any = {};
   @Input() fields: {
    dataField: string;
    label: string;
    type?: string; // This 'type' seems more for general data type, not editorType
    required?: boolean; // Can keep for simple cases or derive from validationRules
    editorType?: string;
    editorOptions?: any;
    validationRules?: DxValidationRule[]; // << NEW: Array of DevExtreme validation rules
  }[] = [];
@ViewChild(DxFormComponent, { static: false }) dxFormInstance!: DxFormComponent;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  handleClose() {
    this.onClose.emit();
    this.resetForm();
  }

  handleSubmit() {
  if (this.dxFormInstance && this.dxFormInstance.instance) {
    const validationResult = this.dxFormInstance.instance.validate();
    if (validationResult.isValid) {
      this.onSubmit.emit(this.formData);
      // this.resetForm(); // Consider parental control for reset
    } else {
      // Optionally: alert('Please correct errors.'); or rely on dx-form UI
    }
  } else {
    // Fallback if form instance isn't ready - unlikely if modal is visible
    console.warn('dxFormInstance not available in FormModalComponent');
    // this.onSubmit.emit(this.formData); // Or don't emit if form can't be validated
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
