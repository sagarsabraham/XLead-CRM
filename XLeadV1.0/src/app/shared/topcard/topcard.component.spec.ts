import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    const iconImgEl = compiled.querySelector('.topcard-icon img'); 
    const iconContainerEl = compiled.querySelector('.topcard-icon');
    const topcardDiv = compiled.querySelector('.topcard');

    expect(amountEl?.textContent?.trim()).toBe('0');
    expect(titleEl?.textContent?.trim()).toBe('');  
    expect(iconImgEl).toBeNull(); 
    expect((iconContainerEl as HTMLElement)?.style.backgroundColor).toBe('rgb(0, 0, 0)'); 
    expect(topcardDiv?.classList.contains('compact')).toBeFalse(); 
  });

  it('should display provided amount, title, and icon (standard, not currency)', () => {
    component.amount = 12345;
    component.title = 'Test Sales';
    component.icon = 'assets/icons/money.svg'; 
    component.iconColor = 'rgb(0, 128, 0)'; 
    component.variant = 'standard';
    component.isCurrency = false;
    fixture.detectChanges();

    const amountEl = compiled.querySelector('.topcard-amount');
    const titleEl = compiled.querySelector('.topcard-title');
    const iconImgEl = compiled.querySelector('.topcard-icon img') as HTMLImageElement;
    const iconContainerEl = compiled.querySelector('.topcard-icon');
    const topcardDiv = compiled.querySelector('.topcard');

    expect(amountEl?.textContent?.trim()).toBe('12345');
    expect(titleEl?.textContent?.trim()).toBe('Test Sales');

    expect(iconImgEl).toBeTruthy();
    
    expect(iconImgEl?.src).toContain('assets/icons/money.svg');
    expect(iconImgEl?.alt).toBe('Test Sales icon');
    expect(iconImgEl?.classList.contains('svg-icon')).toBeTrue();
    expect(iconImgEl?.classList.contains('compact-icon-img')).toBeFalse(); 
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

  it('should apply "compact" class to topcard and icon image when variant is "compact"', () => {
    component.variant = 'compact';
    component.icon = 'assets/icons/user.svg'; 
    fixture.detectChanges();

    const topcardDiv = compiled.querySelector('.topcard');
    const iconImgEl = compiled.querySelector('.topcard-icon img');

    expect(topcardDiv?.classList.contains('compact')).toBeTrue();
    expect(iconImgEl).toBeTruthy(); 
    expect(iconImgEl?.classList.contains('compact-icon-img')).toBeTrue();
  });

  it('should NOT apply "compact" class to topcard or icon image when variant is "standard"', () => {
    component.variant = 'standard';
    component.icon = 'assets/icons/user.svg'; 
    fixture.detectChanges();

    const topcardDiv = compiled.querySelector('.topcard');
    const iconImgEl = compiled.querySelector('.topcard-icon img');

    expect(topcardDiv?.classList.contains('compact')).toBeFalse();
    expect(iconImgEl).toBeTruthy(); 
    expect(iconImgEl?.classList.contains('compact-icon-img')).toBeFalse();
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