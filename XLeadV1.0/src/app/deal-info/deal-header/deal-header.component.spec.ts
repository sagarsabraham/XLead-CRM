import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DealHeaderComponent } from './deal-header.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DealHeaderComponent', () => {
  let component: DealHeaderComponent;
  let fixture: ComponentFixture<DealHeaderComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockDeal = {
    title: 'Test Deal',
    amount: 10000,
    companyName: 'Test Corp',
    closingDate: '2025-12-31'
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DealHeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore template errors
    }).compileComponents();

    fixture = TestBed.createComponent(DealHeaderComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    mockRouter.navigate.calls.reset();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with no deal data', () => {
      expect(component.deal).toBeUndefined();
    });
  });

  describe('Template Rendering', () => {
    it('should render deal title when deal is provided', () => {
      component.deal = mockDeal;
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
      expect(titleElement.textContent).toContain('Test Deal');
    });

    it('should render deal amount with currency formatting', () => {
      component.deal = mockDeal;
      fixture.detectChanges();
      const amountElement = fixture.debugElement.query(By.css('.deal-left p')).nativeElement;
      expect(amountElement.textContent).toContain('$10,000.00');
    });

    it('should render company name', () => {
      component.deal = mockDeal;
      fixture.detectChanges();
      const companyElement = fixture.debugElement.query(By.css('.deal-right p:first-child')).nativeElement;
      expect(companyElement.textContent).toContain('Test Corp');
    });

    it('should render closing date with correct format', () => {
      component.deal = mockDeal;
      fixture.detectChanges();
      const dateElement = fixture.debugElement.query(By.css('.deal-right p:last-child')).nativeElement;
      expect(dateElement.textContent).toContain('31 Dec 2025');
    });

    it('should not throw errors when deal is null', () => {
      component.deal = null;
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('goBack', () => {
    it('should navigate to /pipeline when goBack is called', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/pipeline']);
    });

    it('should trigger goBack when back button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'goBack');
      const button = fixture.debugElement.query(By.css('.back-button')).nativeElement;
      button.click();
      expect(component.goBack).toHaveBeenCalled();
    });
  });

  describe('formatDate', () => {
    it('should format valid date correctly', () => {
      const date = '2025-12-31';
      const formatted = component.formatDate(date);
      expect(formatted).toEqual('31 Dec 2025');
    });

    it('should return empty string for invalid date', () => {
      const formatted = component.formatDate('invalid');
      expect(formatted).toEqual('');
    });

    it('should return empty string for null or undefined date', () => {
      expect(component.formatDate(null)).toEqual('');
      expect(component.formatDate(undefined)).toEqual('');
    });
  });
});