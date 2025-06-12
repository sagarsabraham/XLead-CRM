

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';
import { Component, Input, Output, EventEmitter, DebugElement } from '@angular/core'; 

@Component({
  selector: 'dx-button', 
  template: '<button (click)="onClickEventInternal()"><span class="icon-class-{{icon}}"></span>{{text}}</button>'
})
class MockDxButtonComponent {
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() stylingMode: string = '';
  @Input() type: string = '';
  
  @Output() onClick = new EventEmitter<void>(); 


  onClickEventInternal() {
    this.onClick.emit();
  }
}

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let debugElement: DebugElement;
  let mockDxButtonInstance: MockDxButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ButtonComponent,
        MockDxButtonComponent 
      ],
      
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    const mockDxButtonDebugElement = debugElement.query(By.directive(MockDxButtonComponent));
    if (mockDxButtonDebugElement) {
      mockDxButtonInstance = mockDxButtonDebugElement.componentInstance;
    }
    fixture.detectChanges(); 
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default input values for label and icon', () => {
    expect(component.label).toBe('');
    expect(component.icon).toBe('');
  });


  it('should bind label to MockDxButtonComponent text input', () => {
    const testLabel = 'Submit Action';
    component.label = testLabel;
    fixture.detectChanges();

    expect(mockDxButtonInstance.text).toBe(testLabel);
  });

  it('should bind icon to MockDxButtonComponent icon input', () => {
    const testIcon = 'save';
    component.icon = testIcon;
    fixture.detectChanges();

    expect(mockDxButtonInstance.icon).toBe(testIcon);
  });

  it('should set stylingMode="contained" and type="success" on MockDxButtonComponent', () => {

    fixture.detectChanges();

    expect(mockDxButtonInstance.stylingMode).toBe('contained');
    expect(mockDxButtonInstance.type).toBe('success');
  });

  it('should emit onClick event when MockDxButtonComponent emits its onClick', () => {
    spyOn(component.onClick, 'emit');

    
    mockDxButtonInstance.onClick.emit(); 

   

    expect(component.onClick.emit).toHaveBeenCalled();
  });
});