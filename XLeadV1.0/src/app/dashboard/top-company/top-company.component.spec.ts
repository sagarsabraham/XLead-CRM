import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCompanyComponent } from './top-company.component';

describe('TopCompanyComponent', () => {
  let component: TopCompanyComponent;
  let fixture: ComponentFixture<TopCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
