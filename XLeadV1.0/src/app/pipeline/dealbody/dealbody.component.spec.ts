import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DealbodyComponent } from './dealbody.component';
import { CdkDragDrop, DragDropModule, CdkDropList } from '@angular/cdk/drag-drop';
import { By } from '@angular/platform-browser';
import { ElementRef, Component, Input, Output, EventEmitter } from '@angular/core';
 
describe('DealbodyComponent', () => {
  let component: DealbodyComponent;
  let fixture: ComponentFixture<DealbodyComponent>;
 
  const mockDeals = [
    { id: '1', title: 'Deal 1', amount: 1000 },
    { id: '2', title: 'Deal 2', amount: 2000 },
  ];
 
  const mockConnectedTo = ['stage-1', 'stage-2'];
 
 
  @Component({
    selector: 'app-dealcard',
    template: '',
  })
  class DealcardStubComponent {
    @Input() deal: any;
    @Output() onEdit = new EventEmitter<any>();
  }
 
 
  function createMockCdkDropList(id: string): Partial<CdkDropList<any[]>> {
    return {
      id,
      element: new ElementRef(document.createElement('div')),
      data: [],
      disabled: false,
      lockAxis: undefined,
      connectedTo: [],
      enterPredicate: () => true,
      sortPredicate: () => true,
      sortingDisabled: false,
    };
  }
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DealbodyComponent, DealcardStubComponent],
      imports: [DragDropModule],
    }).compileComponents();
  });
 
  beforeEach(() => {
    fixture = TestBed.createComponent(DealbodyComponent);
    component = fixture.componentInstance;
    component.deals = [...mockDeals];
    component.stageName = 'Stage 1';
    component.connectedTo = [...mockConnectedTo];
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  describe('Input Bindings', () => {
    it('should bind stageName input correctly', () => {
      const stageNameEl = fixture.debugElement.query(By.css('[data-testid="stage-name"]'));
      if (stageNameEl) {
        expect(stageNameEl.nativeElement.textContent).toContain('Stage 1');
      } else {
        expect(component.stageName).toBe('Stage 1');
      }
    });
 
    it('should bind deals input and render deal cards', () => {
      const dealCards = fixture.debugElement.queryAll(By.css('app-dealcard'));
      expect(dealCards.length).toBe(mockDeals.length);
    });
 
    it('should bind connectedTo input correctly', () => {
      expect(component.connectedTo).toEqual(mockConnectedTo);
    });
  });
 
  describe('Drag and Drop Functionality', () => {
    it('should not emit dealDropped if dropped in same container', () => {
      spyOn(component.dealDropped, 'emit');
      const dropList = createMockCdkDropList('stage-1') as CdkDropList<any[]>;
      const mockEvent: Partial<CdkDragDrop<any[]>> = {
        previousContainer: dropList,
        container: dropList, // Use same instance
        previousIndex: 0,
        currentIndex: 1,
      };
      component.drop(mockEvent as CdkDragDrop<any[]>);
      expect(component.dealDropped.emit).not.toHaveBeenCalled();
    });
 
    it('should emit dealDropped with correct data when dropped in different container', () => {
      spyOn(component.dealDropped, 'emit');
      const mockEvent: Partial<CdkDragDrop<any[]>> = {
        previousContainer: createMockCdkDropList('stage-1') as CdkDropList<any[]>,
        container: createMockCdkDropList('stage-2') as CdkDropList<any[]>,
        previousIndex: 0,
        currentIndex: 0,
      };
      component.drop(mockEvent as CdkDragDrop<any[]>);
      expect(component.dealDropped.emit).toHaveBeenCalledWith({
        previousStage: 'stage-1',
        currentStage: 'stage-2',
        previousIndex: 0,
        currentIndex: 0,
      });
    });
  });
 
  describe('Edit Functionality', () => {
    it('should emit onEdit event with deal data when onEditDeal is called', () => {
      spyOn(component.onEdit, 'emit');
      const deal = mockDeals[0];
      component.onEditDeal(deal);
      expect(component.onEdit.emit).toHaveBeenCalledWith(deal);
    });
  });
});
 