import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealinfopageComponent } from './dealinfopage.component';

describe('DealinfopageComponent', () => {
  let component: DealinfopageComponent;
  let fixture: ComponentFixture<DealinfopageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealinfopageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealinfopageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
