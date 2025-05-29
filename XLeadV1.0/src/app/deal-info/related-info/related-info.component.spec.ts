import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedInfoComponent } from './related-info.component';

describe('RelatedInfoComponent', () => {
  let component: RelatedInfoComponent;
  let fixture: ComponentFixture<RelatedInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
