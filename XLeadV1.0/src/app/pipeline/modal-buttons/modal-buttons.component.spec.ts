import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { DxButtonComponent } from 'devextreme-angular/ui/button';
 
import { ModalButtonsComponent } from './modal-buttons.component';
 
describe('ModalButtonsComponent', () => {
  let component: ModalButtonsComponent;
  let fixture: ComponentFixture<ModalButtonsComponent>;
 
  const getButton = (testId: string): DebugElement | null => {
    if (testId === 'customize-button') {
      const customizeContainer = fixture.debugElement.query(By.css('.customize-fields'));
      return customizeContainer ? customizeContainer.query(By.directive(DxButtonComponent)) : null;
    }
    if (testId === 'cancel-button') {
      const modalButtonsContainer = fixture.debugElement.query(By.css('.modal-buttons'));
      const buttons = modalButtonsContainer ? modalButtonsContainer.queryAll(By.directive(DxButtonComponent)) : [];
      return buttons.length > 0 ? buttons[0] : null;
    }
    if (testId === 'save-button') {
      const modalButtonsContainer = fixture.debugElement.query(By.css('.modal-buttons'));
      const buttons = modalButtonsContainer ? modalButtonsContainer.queryAll(By.directive(DxButtonComponent)) : [];
      return buttons.length > 1 ? buttons[1] : null;
    }
    return null;
  };
 
  const getButtonText = (buttonDe: DebugElement): string => {
    const dxButtonInstance = buttonDe.componentInstance as DxButtonComponent;
    if (dxButtonInstance && typeof dxButtonInstance.text === 'string') {
        return dxButtonInstance.text;
    }
    const textElement = buttonDe.query(By.css('.dx-button-text'));
    if (textElement && textElement.nativeElement.textContent) {
      return textElement.nativeElement.textContent.trim();
    }
    return '';
  };
 
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalButtonsComponent],
      imports: [DxButtonModule]
    })
    .compileComponents();
  }));
 
  beforeEach(() => {
    fixture = TestBed.createComponent(ModalButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
 
 
  describe('Default State', () => {
    it('should not show customize button by default', () => {
      expect(component.showCustomize).toBe(false);
      const customizeButton = getButton('customize-button');
      expect(customizeButton).toBeNull();
    });
 
    it('should display "Cancel" for cancel button by default', () => {
      const cancelButton = getButton('cancel-button');
      expect(cancelButton).toBeTruthy();
      if (cancelButton) {
        expect(getButtonText(cancelButton)).toBe('Cancel');
      }
    });
 
    it('should display "Save" for save button by default', () => {
      const saveButton = getButton('save-button');
      expect(saveButton).toBeTruthy();
      if (saveButton) {
         expect(getButtonText(saveButton)).toBe('Save');
      }
    });
 
    it('should have save button enabled by default', () => {
      const saveButtonDe = getButton('save-button');
      expect(saveButtonDe).toBeTruthy();
      if (saveButtonDe) {
        const dxButtonInstance = saveButtonDe.componentInstance as DxButtonComponent;
        expect(dxButtonInstance.disabled).toBe(false);
      }
    });
  });
 
  describe('Inputs', () => {
    it('should show customize button when showCustomize is true and has text', () => {
      component.showCustomize = true;
      component.customize = 'Configure';
      fixture.detectChanges();
 
      const customizeButton = getButton('customize-button');
      expect(customizeButton).toBeTruthy();
      if (customizeButton) {
        expect(getButtonText(customizeButton)).toBe('Configure');
      }
    });
 
    it('should hide customize button when showCustomize is false after being true', () => {
      component.showCustomize = true;
      component.customize = 'Configure';
      fixture.detectChanges();
      expect(getButton('customize-button')).toBeTruthy();
 
      component.showCustomize = false;
      fixture.detectChanges();
      expect(getButton('customize-button')).toBeNull();
    });
 
    it('should update cancel button text via cancelText input', () => {
      component.cancelText = 'Discard';
      fixture.detectChanges();
      const cancelButton = getButton('cancel-button');
      expect(cancelButton).toBeTruthy();
      if (cancelButton) {
        expect(getButtonText(cancelButton)).toBe('Discard');
      }
    });
 
    it('should update save button text via saveText input', () => {
      component.saveText = 'Apply';
      fixture.detectChanges();
      const saveButton = getButton('save-button');
      expect(saveButton).toBeTruthy();
      if (saveButton) {
        expect(getButtonText(saveButton)).toBe('Apply');
      }
    });
 
    it('should disable save button when isSaveDisabled is true', () => {
      component.isSaveDisabled = true;
      fixture.detectChanges();
      const saveButtonDe = getButton('save-button');
      expect(saveButtonDe).toBeTruthy();
      if (saveButtonDe) {
        const dxButtonInstance = saveButtonDe.componentInstance as DxButtonComponent;
        expect(dxButtonInstance.disabled).toBe(true);
        expect(saveButtonDe.nativeElement.getAttribute('aria-disabled')).toBe('true');
      }
    });
 
    it('should enable save button when isSaveDisabled is false', () => {
      component.isSaveDisabled = true;
      fixture.detectChanges();
 
      component.isSaveDisabled = false;
      fixture.detectChanges();
      const saveButtonDe = getButton('save-button');
      expect(saveButtonDe).toBeTruthy();
      if (saveButtonDe) {
        const dxButtonInstance = saveButtonDe.componentInstance as DxButtonComponent;
        expect(dxButtonInstance.disabled).toBe(false);
        const ariaDisabled = saveButtonDe.nativeElement.getAttribute('aria-disabled');
        expect(ariaDisabled === 'false' || ariaDisabled === null).toBeTrue();
      }
    });
  });
 
  describe('Outputs', () => {
    it('should emit onCancel when cancel button is clicked', () => {
      spyOn(component.onCancel, 'emit');
      const cancelButtonDe = getButton('cancel-button');
      expect(cancelButtonDe).toBeTruthy("Cancel button DebugElement not found");
 
      if (cancelButtonDe) {
        const nativeButtonElement = cancelButtonDe.nativeElement as HTMLElement;
        nativeButtonElement.click();
        fixture.detectChanges();
        expect(component.onCancel.emit).toHaveBeenCalledTimes(1);
      }
    });
 
    it('should emit onSave when save button is clicked and enabled', () => {
      spyOn(component.onSave, 'emit');
      component.isSaveDisabled = false;
      fixture.detectChanges();
 
      const saveButtonDe = getButton('save-button');
      expect(saveButtonDe).toBeTruthy("Save button DebugElement not found");
 
      if (saveButtonDe) {
        const nativeButtonElement = saveButtonDe.nativeElement as HTMLElement;
        nativeButtonElement.click();
        fixture.detectChanges();
        expect(component.onSave.emit).toHaveBeenCalledTimes(1);
      }
    });
 
    it('should NOT emit onSave when save button is clicked and disabled', () => {
      spyOn(component.onSave, 'emit');
      component.isSaveDisabled = true;
      fixture.detectChanges();
 
      const saveButtonDe = getButton('save-button');
      expect(saveButtonDe).toBeTruthy("Save button DebugElement not found (disabled case)");
 
      if (saveButtonDe) {
        const dxButtonInstance = saveButtonDe.componentInstance as DxButtonComponent;
        expect(dxButtonInstance.disabled).toBe(true);
 
        const nativeButtonElement = saveButtonDe.nativeElement as HTMLElement;
        nativeButtonElement.click();
        fixture.detectChanges();
 
        expect(component.onSave.emit).not.toHaveBeenCalled();
      }
    });
 
    it('should emit onCustomize when customize button is clicked', () => {
      spyOn(component.onCustomize, 'emit');
      component.showCustomize = true;
      component.customize = "My Customize";
      fixture.detectChanges();
 
      const customizeButtonDe = getButton('customize-button');
      expect(customizeButtonDe).toBeTruthy("Customize button DebugElement not found");
 
      if (customizeButtonDe) {
        const nativeButtonElement = customizeButtonDe.nativeElement as HTMLElement;
        nativeButtonElement.click();
        fixture.detectChanges();
        expect(component.onCustomize.emit).toHaveBeenCalledTimes(1);
      }
    });
  });
 
 
});