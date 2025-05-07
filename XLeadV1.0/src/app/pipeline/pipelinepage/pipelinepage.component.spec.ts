import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelinepageComponent } from './pipelinepage.component';

describe('PipelinepageComponent', () => {
  let component: PipelinepageComponent;
  let fixture: ComponentFixture<PipelinepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelinepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipelinepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
