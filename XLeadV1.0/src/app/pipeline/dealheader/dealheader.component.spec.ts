import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DealheaderComponent } from './dealheader.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
 
describe('DealheaderComponent', () => {
  let component: DealheaderComponent;
  let fixture: ComponentFixture<DealheaderComponent>;
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DealheaderComponent],
      imports: [CommonModule], // For currency pipe
      schemas: [NO_ERRORS_SCHEMA] // Avoid issues with unknown elements/attributes
    }).compileComponents();
 
    fixture = TestBed.createComponent(DealheaderComponent);
    component = fixture.componentInstance;
  });
 
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
 
  it('should display stageName, amount and dealCount when not collapsed', () => {
    component.stageName = 'Prospecting';
    component.amount = 10000;
    component.dealCount = 3;
    component.collapsed = false;
    fixture.detectChanges();
 
    const title = fixture.debugElement.query(By.css('.title'))?.nativeElement;
    const amount = fixture.debugElement.query(By.css('.amount'))?.nativeElement;
    const count = fixture.debugElement.query(By.css('.count'))?.nativeElement;
 
    expect(title.textContent).toContain('Prospecting');
    expect(amount.textContent).toContain('$10,000.00');
    expect(count.textContent).toContain('3 Deals');
  });
 
  it('should display vertical layout when collapsed', () => {
    component.stageName = 'Negotiation';
    component.amount = 2000;
    component.dealCount = 1;
    component.collapsed = true;
    fixture.detectChanges();
 
    const verticalItems = fixture.debugElement.queryAll(By.css('.vertical-item'));
    expect(verticalItems.length).toBe(3);
    expect(verticalItems[0].nativeElement.textContent).toContain('Negotiation');
    expect(verticalItems[1].nativeElement.textContent).toContain('1 Deal');
    expect(verticalItems[2].nativeElement.textContent).toContain('$2,000.00');
  });
 
  it('should apply class "closed-won" if stageName is "Closed Won"', () => {
    component.stageName = 'Closed Won';
    fixture.detectChanges();
    const rootEl = fixture.debugElement.query(By.css('.deal-header')).nativeElement;
    expect(rootEl.classList).toContain('closed-won');
  });
 
  it('should apply class "closed-lost" if stageName is "Closed Lost"', () => {
    component.stageName = 'Closed Lost';
    fixture.detectChanges();
    const rootEl = fixture.debugElement.query(By.css('.deal-header')).nativeElement;
    expect(rootEl.classList).toContain('closed-lost');
  });
 
  it('should add "vertical" class when collapsed', () => {
    component.collapsed = true;
    fixture.detectChanges();
    const rootEl = fixture.debugElement.query(By.css('.deal-header')).nativeElement;
    expect(rootEl.classList).toContain('vertical');
  });
});
 
 