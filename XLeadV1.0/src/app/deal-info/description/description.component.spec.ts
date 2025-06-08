import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionComponent } from './description.component';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DescriptionComponent', () => {
  let component: DescriptionComponent;
  let fixture: ComponentFixture<DescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescriptionComponent],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.description).toBe(''); 
      expect(component.isEditing).toBeFalse();
      expect(component.editedDescription).toBe('');
      expect(component.descriptionChange).toBeInstanceOf(EventEmitter);
    });
  });

  describe('Template Rendering', () => {
    it('should display description text when not editing', () => {
      component.description = 'Test description';
      fixture.detectChanges();
      const descriptionText = fixture.debugElement.query(By.css('.description-text')).nativeElement;
      expect(descriptionText.textContent.trim()).toBe('Test description');
    });

    it('should display default message when description is empty', () => {
      component.description = '';
      fixture.detectChanges();
      const descriptionText = fixture.debugElement.query(By.css('.description-text')).nativeElement;
      expect(descriptionText.textContent.trim()).toBe('No description available');
    });

    it('should show edit button when not editing', () => {
      component.isEditing = false;
      fixture.detectChanges();
      const editIcon = fixture.debugElement.query(By.css('.dx-icon-edit'));
      expect(editIcon).toBeTruthy();
    });

    it('should hide edit button and show edit mode when editing', () => {
      component.isEditing = true;
      fixture.detectChanges();
      const editIcon = fixture.debugElement.query(By.css('.dx-icon-edit'));
      const editMode = fixture.debugElement.query(By.css('.edit-mode'));
      expect(editIcon).toBeNull();
      expect(editMode).toBeTruthy();
    });

    it('should render dx-text-box and action buttons in edit mode', () => {
      component.isEditing = true;
      fixture.detectChanges();
      const textBox = fixture.debugElement.query(By.css('dx-text-box'));
      const checkIcon = fixture.debugElement.query(By.css('.dx-icon-check'));
      const closeIcon = fixture.debugElement.query(By.css('.dx-icon-close'));
      expect(textBox).toBeTruthy();
      expect(checkIcon).toBeTruthy();
      expect(closeIcon).toBeTruthy();
    });
  });

  describe('Methods', () => {
    describe('startEditing', () => {
      it('should enable editing and set editedDescription to description', () => {
        component.description = 'Test description';
        component.startEditing();
        expect(component.isEditing).toBeTrue();
        expect(component.editedDescription).toBe('Test description');
      });

      it('should set editedDescription to empty string when description is empty', () => {
        component.description = '';
        component.startEditing();
        expect(component.isEditing).toBeTrue();
        expect(component.editedDescription).toBe('');
      });
    });

    describe('saveDescription', () => {
      it('should update description, emit descriptionChange, and disable editing', () => {
        let emittedDescription: string | undefined;
        component.descriptionChange.subscribe((value: string) => {
          emittedDescription = value;
        });
        component.editedDescription = 'New description';
        component.isEditing = true;
        component.saveDescription();
        expect(component.description).toBe('New description');
        expect(emittedDescription).toBe('New description');
        expect(component.isEditing).toBeFalse();
      });
    });

    describe('cancelEditing', () => {
      it('should disable editing and reset editedDescription to description', () => {
        component.description = 'Original description';
        component.isEditing = true;
        component.editedDescription = 'Temp description';
        component.cancelEditing();
        expect(component.isEditing).toBeFalse();
        expect(component.editedDescription).toBe('Original description');
      });

      it('should set editedDescription to empty string when description is empty', () => {
        component.description = '';
        component.isEditing = true;
        component.editedDescription = 'Temp description';
        component.cancelEditing();
        expect(component.isEditing).toBeFalse();
        expect(component.editedDescription).toBe('');
      });
    });
  });

  describe('User Interactions', () => {
    it('should call startEditing when edit button is clicked', () => {
      spyOn(component, 'startEditing');
      component.isEditing = false;
      fixture.detectChanges();
      const editIcon = fixture.debugElement.query(By.css('.dx-icon-edit')).nativeElement;
      editIcon.click();
      expect(component.startEditing).toHaveBeenCalled();
    });

    it('should call saveDescription when check icon is clicked', () => {
      spyOn(component, 'saveDescription');
      component.isEditing = true;
      fixture.detectChanges();
      const checkIcon = fixture.debugElement.query(By.css('.dx-icon-check')).nativeElement;
      checkIcon.click();
      expect(component.saveDescription).toHaveBeenCalled();
    });

    it('should call cancelEditing when close icon is clicked', () => {
      spyOn(component, 'cancelEditing');
      component.isEditing = true;
      fixture.detectChanges();
      const closeIcon = fixture.debugElement.query(By.css('.dx-icon-close')).nativeElement;
      closeIcon.click();
      expect(component.cancelEditing).toHaveBeenCalled();
    });
  });
});