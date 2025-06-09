import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { DxFormComponent, DxPopupComponent , DxToastComponent} from 'devextreme-angular';

export interface DxValidationRule {
  type: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email';
  message: string;
  min?: number | Date;
  max?: number | Date;
  pattern?: string | RegExp;
  comparisonTarget?: () => any;
  comparisonType?: string;
  validationCallback?: (options: { value: any; rule: DxValidationRule; data: any; }) => boolean;
}

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements AfterViewInit {
  @Input() isVisible: boolean = false;
  @Input() title: string = '';
  @Input() formData: any = {};
  @Input() fields: {
    dataField: string;
    label: string;
    type?: string;
    required?: boolean;
    editorType?: string;
    editorOptions?: any;
    validationRules?: DxValidationRule[];
  }[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  @ViewChild(DxFormComponent, { static: false }) dxFormInstance!: DxFormComponent;
  @ViewChild('formContainer', { static: false }) formContainer!: ElementRef<HTMLDivElement>;
  @ViewChild(DxPopupComponent, { static: false }) dxPopup!: DxPopupComponent;
    @ViewChild('toastInstance', { static: false }) toastInstance!: DxToastComponent;

  private isViewInitialized: boolean = false;
  toastMessage: string = '';
  toastType: 'info' | 'success' | 'error' | 'warning' = 'info';
  toastVisible: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}
  showToast(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.cdr.detectChanges();
  }
 

  ngAfterViewInit() {
    if (this.dxPopup && this.dxPopup.instance) {
      this.dxPopup.instance.on('shown', () => {
        if (this.formContainer && this.formContainer.nativeElement) {
          this.isViewInitialized = true;
          this.cdr.detectChanges();
        }
      });

      this.dxPopup.instance.on('hiding', () => {
        this.isViewInitialized = false;
      });
    }
  }

  showToast(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.cdr.detectChanges();
  }

  handleClose() {
    this.onClose.emit();
    this.resetForm();
    this.isViewInitialized = false;
  }

  handleSubmit() {
    if (this.dxFormInstance && this.dxFormInstance.instance) {
      const validationResult = this.dxFormInstance.instance.validate();
      if (validationResult.isValid) {
        this.onSubmit.emit(this.formData);
      } else {
        this.showToast('Please correct errors.', 'error');
      }
    }
  }

  resetForm() {
    this.fields.forEach(field => {
      if (field.editorType === 'dxSelectBox' && field.editorOptions?.items) {
        this.formData[field.dataField] = field.editorOptions.items[0] || '';
      } else {
        this.formData[field.dataField] = '';
      }
    });
  }

  @HostListener('wheel', ['$event'])
  onHostWheel(event: WheelEvent) {
    if (!this.isViewInitialized) {
      return;
    }

    if (this.formContainer && this.formContainer.nativeElement) {
      const container = this.formContainer.nativeElement;
      const isMouseOverContainer = container.contains(event.target as Node);

      if (isMouseOverContainer) {
        const newScrollTop = container.scrollTop + event.deltaY;
        const maxScrollTop = container.scrollHeight - container.clientHeight;

        container.scrollTop = Math.max(0, Math.min(newScrollTop, maxScrollTop));
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }
}