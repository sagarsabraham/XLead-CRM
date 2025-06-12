import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusTimelineComponent } from './status-timeline.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('StatusTimelineComponent', () => {
  let component: StatusTimelineComponent;
  let fixture: ComponentFixture<StatusTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusTimelineComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should normalize stage correctly', () => {
    expect(component['normalizeStage']('qualification')).toBe('Qualification');
    expect(component['normalizeStage']('ClosedLost')).toBe('Closed Lost');
    expect(component['normalizeStage']('proposalpricequote')).toBe('Proposal/Price Quote');
  });

  it('should emit stageChange on stage click if stage is different', () => {
    component.currentStage = 'Qualification';
    spyOn(component.stageChange, 'emit');

    component.onStageClick('Need Analysis');
    expect(component.stageChange.emit).toHaveBeenCalledWith('Need Analysis');
  });

  it('should not emit stageChange if stage is same', () => {
    component.currentStage = 'Qualification';
    spyOn(component.stageChange, 'emit');

    component.onStageClick('Qualification');
    expect(component.stageChange.emit).not.toHaveBeenCalled();
  });

  it('should return correct current stage index', () => {
    component.currentStage = 'Proposal/Price Quote';
    expect(component.getCurrentStageIndex()).toBe(2);

    component.currentStage = 'Nonexistent';
    expect(component.getCurrentStageIndex()).toBe(0);
  });

  it('should mark completed stages correctly', () => {
    component.currentStage = 'Negotiation/Review';
    expect(component.isStageCompleted(0)).toBeTrue(); // Qualification
    expect(component.isStageCompleted(3)).toBeFalse(); // Negotiation/Review
  });

  it('should mark all stages up to index 3 completed for Closed Won', () => {
    component.currentStage = 'Closed Won';
    for (let i = 0; i < 4; i++) {
      expect(component.isStageCompleted(i)).toBeTrue();
    }
    expect(component.isStageCompleted(4)).toBeFalse();
  });

  it('should mark connectors as completed for Closed Won up to index 3', () => {
    component.currentStage = 'Closed Won';
    for (let i = 0; i < 4; i++) {
      expect(component.isConnectorCompleted(i)).toBeTrue();
    }
    expect(component.isConnectorCompleted(4)).toBeFalse();
  });

  it('should detect mobile view on small screen', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(500);
    component.checkScreenSize();
    expect(component.isMobile).toBeTrue();
  });

  it('should detect desktop view on wide screen', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);
    component.checkScreenSize();
    expect(component.isMobile).toBeFalse();
  });

  it('should update normalized stage on input change', () => {
    component.ngOnChanges({
      currentStage: {
        previousValue: 'Need Analysis',
        currentValue: 'proposal',
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.currentStage).toBe('Proposal/Price Quote');
  });
});
