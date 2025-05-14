import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealHeaderComponent } from './deal-header.component';

describe('DealHeaderComponent', () => {
  let component: DealHeaderComponent;
  let fixture: ComponentFixture<DealHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
