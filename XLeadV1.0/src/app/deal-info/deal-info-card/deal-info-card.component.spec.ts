import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealInfoCardComponent } from './deal-info-card.component';

describe('DealInfoCardComponent', () => {
  let component: DealInfoCardComponent;
  let fixture: ComponentFixture<DealInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealInfoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
