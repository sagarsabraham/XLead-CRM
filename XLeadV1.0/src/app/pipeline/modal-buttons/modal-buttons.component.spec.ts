import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalButtonsComponent } from './modal-buttons.component';

describe('ModalButtonsComponent', () => {
  let component: ModalButtonsComponent;
  let fixture: ComponentFixture<ModalButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
