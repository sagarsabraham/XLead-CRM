import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

import { TopcardComponent } from './topcard.component';

describe('TopcardComponent', () => {
  let component: TopcardComponent;
  let fixture: ComponentFixture<TopcardComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopcardComponent],
      imports: [CurrencyPipe],
      providers: [{ provide: LOCALE_ID, useValue: 'en-IN' }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopcardComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display default values when no inputs are provided', () => {
    fixture.detectChanges();

    const amountEl = compiled.querySelector('.topcard-amount');
    const titleEl = compiled.querySelector('.topcard-title');
    const iconEl = compiled.querySelector('.topcard-icon i');
    const iconContainerEl = compiled.querySelector('.topcard-icon');
    const topcardDiv = compiled.querySelector('.topcard');

    expect(amountEl?.textContent?.trim()).toBe('0');
    expect(titleEl?.textContent?.trim()).toBe('');
    expect(iconEl?.classList.contains('dx-icon-')).toBeTrue();
    expect((iconContainerEl as HTMLElement)?.style.backgroundColor).toBe('');
    expect(topcardDiv?.classList.contains('compact')).toBeFalse();
  });

  it('should display provided amount, title, and icon (standard, not currency)', () => {
    component.amount = 12345;
    component.title = 'Test Sales';
    component.icon = 'money';
    component.iconColor = 'rgb(0, 128, 0)';
    component.variant = 'standard';
    component.isCurrency = false;
    fixture.detectChanges();

    const amountEl = compiled.querySelector('.topcard-amount');
    const titleEl = compiled.querySelector('.topcard-title');
    const iconEl = compiled.querySelector('.topcard-icon i');
    const iconContainerEl = compiled.querySelector('.topcard-icon');
    const topcardDiv = compiled.querySelector('.topcard');

    expect(amountEl?.textContent?.trim()).toBe('12345');
    expect(titleEl?.textContent?.trim()).toBe('Test Sales');
    expect(iconEl?.classList.contains('dx-icon-money')).toBeTrue();
    expect((iconContainerEl as HTMLElement)?.style.backgroundColor).toBe('rgb(0, 128, 0)');
    expect(topcardDiv?.classList.contains('compact')).toBeFalse();
  });

  it('should format amount as INR currency when isCurrency is true', () => {
    component.amount = 5678.99;
    component.isCurrency = true;
    fixture.detectChanges();

    const amountEl = compiled.querySelector('.topcard-amount');
    expect(amountEl?.textContent).toContain('₹');
    expect(amountEl?.textContent).toContain('5,678.99');

    component.amount = 0;
    fixture.detectChanges();
    expect(amountEl?.textContent).toContain('₹');
    expect(amountEl?.textContent).toContain('0.00');
  });

  it('should apply "compact" class when variant is "compact"', () => {
    component.variant = 'compact';
    fixture.detectChanges();

    const topcardDiv = compiled.querySelector('.topcard');
    expect(topcardDiv?.classList.contains('compact')).toBeTrue();
  });

  it('should NOT apply "compact" class when variant is "standard"', () => {
    component.variant = 'standard';
    fixture.detectChanges();

    const topcardDiv = compiled.querySelector('.topcard');
    expect(topcardDiv?.classList.contains('compact')).toBeFalse();
  });

  it('should toggle between currency and non-currency display', () => {
    component.amount = 987.65;
    component.isCurrency = false;
    fixture.detectChanges();

    const amountEl = compiled.querySelector('.topcard-amount');
    expect(amountEl?.textContent?.trim()).toBe('987.65');

    component.isCurrency = true;
    fixture.detectChanges();
    expect(amountEl?.textContent).toContain('₹');
    expect(amountEl?.textContent).toContain('987.65');

    component.isCurrency = false;
    fixture.detectChanges();
    expect(amountEl?.textContent?.trim()).toBe('987.65');
  });
});
