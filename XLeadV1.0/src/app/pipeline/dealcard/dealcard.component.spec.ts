import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DebugElement } from '@angular/core'; // Import DebugElement

import { DealcardComponent } from './dealcard.component';

describe('DealcardComponent', () => {
  let component: DealcardComponent;
  let fixture: ComponentFixture<DealcardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockDeal = {
    title: 'Big Deal Q4',
    amount: 150000.75,
    closeDate: new Date(2024, 11, 20), // Dec 20, 2024
    account: 'Acme Corp',
    companyName: '(Subsidiary Inc.)',
    department: 'Sales EMEA',
    probability: '75%',
    region: 'Europe',
    doc: 'contract.pdf'
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DealcardComponent],
      imports: [CommonModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        CurrencyPipe,
        DatePipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealcardComponent);
    component = fixture.componentInstance;
    component.deal = { ...mockDeal };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Display Logic', () => {
    let dealContentElements: DebugElement[]; // To store the queried .deal-content elements

    beforeEach(() => {
      // Query all .deal-content divs that are direct children of .content
      // This is done once before all tests in this describe block.
      dealContentElements = fixture.debugElement.queryAll(By.css('.content > .deal-content'));
    });

    it('should display the deal title', () => {
      const titleEl = fixture.debugElement.query(By.css('.dealname')).nativeElement;
      expect(titleEl.textContent).toContain(mockDeal.title);
    });

    it('should display the deal amount formatted as currency', () => {
      const amountEl = fixture.debugElement.query(By.css('.deal-details > div:nth-child(1)')).nativeElement;
      expect(amountEl.textContent).toMatch(/\$\s*150,000\.75/);
    });

    it('should display the deal close date formatted', () => {
      const dateEl = fixture.debugElement.query(By.css('.deal-details > div:nth-child(2)')).nativeElement;
      expect(dateEl.textContent).toContain('20 Dec 2024');
    });

    it('should display account and company name', () => {
      // The first element in our filtered list
      expect(dealContentElements.length).toBeGreaterThanOrEqual(1); // Basic sanity check
      const accountCompanyEl = dealContentElements[0].nativeElement;
      expect(accountCompanyEl.textContent).toContain(mockDeal.account);
      expect(accountCompanyEl.textContent).toContain(mockDeal.companyName);
    });

    it('should display department', () => {
      // The second element in our filtered list
      expect(dealContentElements.length).toBeGreaterThanOrEqual(2);
      const departmentEl = dealContentElements[1].nativeElement;
      expect(departmentEl.textContent).toContain(mockDeal.department);
    });

    it('should display probability', () => {
      // The third element in our filtered list
      expect(dealContentElements.length).toBeGreaterThanOrEqual(3);
      const probabilityEl = dealContentElements[2].nativeElement;
      expect(probabilityEl.textContent).toContain(mockDeal.probability);
    });

    it('should display region', () => {
      // The fourth element in our filtered list
      expect(dealContentElements.length).toBeGreaterThanOrEqual(4);
      const regionEl = dealContentElements[3].nativeElement;
      expect(regionEl.textContent).toContain(mockDeal.region);
    });
  });

  // ... rest of your tests (Hover and Edit Icon, Card Click, Edit Click) ...
  // These should remain the same as they were not affected by this specific selector issue.

  describe('Hover and Edit Icon', () => {
    it('should set hover to true on mouseenter', () => {
      const cardDiv = fixture.debugElement.query(By.css('.deal-card'));
      cardDiv.triggerEventHandler('mouseenter', null);
      fixture.detectChanges();
      expect(component.hover).toBeTrue();
    });

    it('should set hover to false on mouseleave', () => {
      const cardDiv = fixture.debugElement.query(By.css('.deal-card'));
      component.hover = true;
      fixture.detectChanges();

      cardDiv.triggerEventHandler('mouseleave', null);
      fixture.detectChanges();
      expect(component.hover).toBeFalse();
    });

    it('should show edit icon when hover is true', () => {
      component.hover = true;
      fixture.detectChanges();
      const editIcon = fixture.debugElement.query(By.css('.edit-icon'));
      expect(editIcon).toBeTruthy();
    });

    it('should hide edit icon when hover is false', () => {
      component.hover = false;
      fixture.detectChanges();
      const editIcon = fixture.debugElement.query(By.css('.edit-icon'));
      expect(editIcon).toBeFalsy();
    });
  });

  describe('Card Click Functionality', () => {
    it('should navigate to dealinfo route with deal state on card click', () => {
      const cardDiv = fixture.debugElement.query(By.css('.deal-card'));
      cardDiv.triggerEventHandler('click', null);

      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/dealinfo'],
        { state: { deal: mockDeal } }
      );
    });

    it('onCardClick method should call router.navigate with correct parameters', () => {
      component.onCardClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/dealinfo'],
        { state: { deal: mockDeal } }
      );
    });
  });

  describe('Edit Click Functionality', () => {
    let mockClickEvent: jasmine.SpyObj<Event>;

    beforeEach(() => {
        mockClickEvent = jasmine.createSpyObj('Event', ['stopPropagation']);
    });

    it('should emit onEdit event with deal data when edit icon is clicked', () => {
      spyOn(component.onEdit, 'emit');
      component.hover = true;
      fixture.detectChanges();

      const editIcon = fixture.debugElement.query(By.css('.edit-icon'));
      expect(editIcon).toBeTruthy();

      component.onEditClick(mockClickEvent);
      expect(component.onEdit.emit).toHaveBeenCalledWith(mockDeal);
    });

    it('should stop event propagation when edit icon is clicked', () => {
      component.hover = true;
      fixture.detectChanges();
      const editIcon = fixture.debugElement.query(By.css('.edit-icon'));
      editIcon.triggerEventHandler('click', mockClickEvent);

      expect(mockClickEvent.stopPropagation).toHaveBeenCalled();
    });

    it('clicking edit icon should not trigger onCardClick (due to stopPropagation)', () => {
        spyOn(component, 'onCardClick').and.callThrough(); // Use callThrough if you want to ensure it's not called
        component.hover = true;
        fixture.detectChanges();

        const editIcon = fixture.debugElement.query(By.css('.edit-icon'));
        editIcon.triggerEventHandler('click', mockClickEvent);

        expect(component.onCardClick).not.toHaveBeenCalled();
    });
  });
});