import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricCardOutlineComponent } from './metric-card-outline.component';

describe('MetricCardOutlineComponent', () => {
  let component: MetricCardOutlineComponent;
  let fixture: ComponentFixture<MetricCardOutlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCardOutlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricCardOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
