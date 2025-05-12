import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealfooterComponent } from './dealfooter.component';

describe('DealfooterComponent', () => {
  let component: DealfooterComponent;
  let fixture: ComponentFixture<DealfooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealfooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
