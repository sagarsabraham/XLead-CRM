import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DealfooterComponent } from './dealfooter.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

// Stub child components used inside DealfooterComponent
@Component({
  selector: 'app-button',
  template: ''
})
class MockAppButtonComponent {
  @Input() label!: string;
  @Input() icon!: string;
  @Output() onClick = new EventEmitter<void>();
}

@Component({
  selector: 'dx-button',
  template: ''
})
class MockDxButtonComponent {
  @Input() icon!: string;
  @Output() onClick = new EventEmitter<void>();
}

describe('DealfooterComponent', () => {
  let component: DealfooterComponent;
  let fixture: ComponentFixture<DealfooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DealfooterComponent, MockAppButtonComponent, MockDxButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DealfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-button components based on input', () => {
    component.buttons = [
      { label: 'Save', icon: 'save' },
      { label: 'Delete', icon: 'trash' }
    ];
    fixture.detectChanges();

    const buttonElements = fixture.debugElement.queryAll(By.directive(MockAppButtonComponent));
    expect(buttonElements.length).toBe(2);
  });

  it('should emit buttonClick with correct label and stageId', () => {
    spyOn(component.buttonClick, 'emit');
    component.stageId = 3;
    component.onButtonClick('Save');

    expect(component.buttonClick.emit).toHaveBeenCalledWith({ label: 'Save', stageId: 3 });
  });

  it('should emit collapse event when onCollapse is called', () => {
    spyOn(component.collapse, 'emit');
    component.onCollapse();

    expect(component.collapse.emit).toHaveBeenCalled();
  });
});
