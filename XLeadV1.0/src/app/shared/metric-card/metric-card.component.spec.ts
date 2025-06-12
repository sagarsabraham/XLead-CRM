import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MetricCardComponent } from './metric-card.component';
import { DebugElement } from '@angular/core'; 

describe('MetricCardComponent', () => {
  let component: MetricCardComponent;
  let fixture: ComponentFixture<MetricCardComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricCardComponent ]
     
    })
    .compileComponents(); 
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricCardComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default input values', () => {
    expect(component.title).toBe('');
    expect(component.value).toBe('0');
    expect(component.percentage).toBe(0);
    expect(component.isPositive).toBe(true);
  });

  it('should display the title correctly', () => {
    const testTitle = 'Total Revenue';
    component.title = testTitle;
    fixture.detectChanges(); 
    const h3Element = debugElement.query(By.css('h3')).nativeElement;
    expect(h3Element.textContent).toBe(testTitle);
  });

  it('should display the value correctly', () => {
    const testValue = '$1,250,000';
    component.value = testValue;
    fixture.detectChanges();
    const valueDiv = debugElement.query(By.css('.metric-value')).nativeElement;
    expect(valueDiv.textContent).toBe(testValue);
  });

  it('should display the percentage correctly', () => {
    const testPercentage = 15.5;
    component.percentage = testPercentage;
    fixture.detectChanges();
  
    const percentageSpan = debugElement.query(By.css('.trend-pill > span:first-child')).nativeElement;
    expect(percentageSpan.textContent).toContain(`${testPercentage}%`);
  });

  describe('isPositive trend', () => {
    beforeEach(() => {
      component.isPositive = true;
      fixture.detectChanges();
    });

    it('should apply "positive" class to .metric-trend when isPositive is true', () => {
      const trendDiv = debugElement.query(By.css('.metric-trend')).nativeElement;
      expect(trendDiv.classList).toContain('positive');
      expect(trendDiv.classList).not.toContain('negative');
    });

    it('should apply "positive-icon" and "dx-icon-spinup" to icon span when isPositive is true', () => {
      const iconSpan = debugElement.query(By.css('.icons-for-trend')).nativeElement;
      expect(iconSpan.classList).toContain('positive-icon');
      expect(iconSpan.classList).toContain('dx-icon-spinup');
      expect(iconSpan.classList).not.toContain('negative-icon');
      expect(iconSpan.classList).not.toContain('dx-icon-spindown');
    });
  });

  describe('isNegative trend', () => {
    beforeEach(() => {
      component.isPositive = false;
      fixture.detectChanges();
    });

    it('should apply "negative" class to .metric-trend when isPositive is false', () => {
      const trendDiv = debugElement.query(By.css('.metric-trend')).nativeElement;
      expect(trendDiv.classList).toContain('negative');
      expect(trendDiv.classList).not.toContain('positive');
    });

    it('should apply "negative-icon" and "dx-icon-spindown" to icon span when isPositive is false', () => {
      const iconSpan = debugElement.query(By.css('.icons-for-trend')).nativeElement;
      expect(iconSpan.classList).toContain('negative-icon');
      expect(iconSpan.classList).toContain('dx-icon-spindown');
      expect(iconSpan.classList).not.toContain('positive-icon');
      expect(iconSpan.classList).not.toContain('dx-icon-spinup');
    });
  });

  it('should update view when input properties change', () => {

    fixture.detectChanges();
    const h3Element = debugElement.query(By.css('h3')).nativeElement;
    expect(h3Element.textContent).toBe(''); 


    component.title = 'New KPI';
    component.value = '500';
    component.percentage = -5;
    component.isPositive = false;
    fixture.detectChanges(); 


    expect(h3Element.textContent).toBe('New KPI');
    const valueDiv = debugElement.query(By.css('.metric-value')).nativeElement;
    expect(valueDiv.textContent).toBe('500');
    const percentageSpan = debugElement.query(By.css('.trend-pill > span:first-child')).nativeElement;
    expect(percentageSpan.textContent).toContain('-5%');
    const trendDiv = debugElement.query(By.css('.metric-trend')).nativeElement;
    expect(trendDiv.classList).toContain('negative');
    const iconSpan = debugElement.query(By.css('.icons-for-trend')).nativeElement;
    expect(iconSpan.classList).toContain('negative-icon');
    expect(iconSpan.classList).toContain('dx-icon-spindown');
  });
});