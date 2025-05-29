import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineStageGraphComponent } from './pipeline-stage-graph.component';

describe('PipelineStageGraphComponent', () => {
  let component: PipelineStageGraphComponent;
  let fixture: ComponentFixture<PipelineStageGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelineStageGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipelineStageGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
