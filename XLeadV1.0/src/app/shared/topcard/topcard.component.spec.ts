import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common'; // Import CurrencyPipe
import { LOCALE_ID } from '@angular/core'; // To set the locale for currency
import { TopcardComponent } from './topcard.component';
 

describe('TopcardComponent', () => {
  let component: TopcardComponent;
  let fixture: ComponentFixture<TopcardComponent>;
  let compiled: HTMLElement;
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopcardComponent, CurrencyPipe], // Declare CurrencyPipe if not using CommonModule
      // OR
      // imports: [CommonModule] // if you prefer to import CommonModule which provides CurrencyPipe
      providers: [
        CurrencyPipe, // Provide CurrencyPipe for injection if needed (though usually comes from CommonModule)
        { provide: LOCALE_ID, useValue: 'en-IN' } // Set locale for consistent currency testing
      ]
    })
    .compileComponents();
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
    fixture.detectChanges(); // Trigger change detection
 
    const amountEl = compiled.querySelector('.topcard-amount');
    const titleEl = compiled.querySelector('.topcard-title');
    const iconEl = compiled.querySelector('.topcard-icon i');
    const iconContainerEl = compiled.querySelector('.topcard-icon');
    const topcardDiv = compiled.querySelector('.topcard');
 
    expect(amountEl?.textContent?.trim()).toBe('0'); // Default amount is 0, not currency
    expect(titleEl?.textContent?.trim()).toBe('');   // Default title is empty
    expect(iconEl?.classList.contains('dx-icon-')).toBeTrue(); // Default icon is empty string, so "dx-icon-"
    expect((iconContainerEl as HTMLElement)?.style.backgroundColor).toBe(''); // Default iconColor is empty
    expect(topcardDiv?.classList.contains('compact')).toBeFalse(); // Default variant is 'default'
  });
 
  it('should display provided amount, title, and icon (default, not currency)', () => {
    component.amount = 12345;
    component.title = 'Test Sales';
    component.icon = 'money';
    component.iconColor = 'rgb(0, 128, 0)'; // green
    component.variant = 'default';
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
    // Expected format: ₹5,678.99 (with non-breaking space for some locales, but 'en-IN' is usually direct)
    // UsingtoContain to be more flexible with minor spacing variations if any
    expect(amountEl?.textContent).toContain('₹');
    expect(amountEl?.textContent).toContain('5,678.99');
 
    // Test with zero
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
 
  it('should NOT apply "compact" class when variant is "default"', () => {
    component.variant = 'default';
    fixture.detectChanges();
 
    const topcardDiv = compiled.querySelector('.topcard');
    expect(topcardDiv?.classList.contains('compact')).toBeFalse();
  });
 
 
  it('should dynamically change icon and iconColor', () => {
    component.icon = 'user';
    component.iconColor = 'blue';
    fixture.detectChanges();
 
    let iconEl = compiled.querySelector('.topcard-icon i');
    let iconContainerEl = compiled.querySelector('.topcard-icon');
 
    expect(iconEl?.classList.contains('dx-icon-user')).toBeTrue();
    expect((iconContainerEl as HTMLElement)?.style.backgroundColor).toBe('blue');
 
    // Change inputs
    component.icon = 'cart';
    component.iconColor = 'red';
    fixture.detectChanges();
 
    iconEl = compiled.querySelector('.topcard-icon i'); // Re-query after change
    iconContainerEl = compiled.querySelector('.topcard-icon'); // Re-query
 
    expect(iconEl?.classList.contains('dx-icon-cart')).toBeTrue();
    expect(iconEl?.classList.contains('dx-icon-user')).toBeFalse();
    expect((iconContainerEl as HTMLElement)?.style.backgroundColor).toBe('red');
  });
 
  it('should toggle between currency and non-currency display', () => {
    component.amount = 987.65;
    component.isCurrency = false;
    fixture.detectChanges();
 
    const amountEl = compiled.querySelector('.topcard-amount');
    expect(amountEl?.textContent?.trim()).toBe('987.65');
 
    // Change to currency
    component.isCurrency = true;
    fixture.detectChanges();
    expect(amountEl?.textContent).toContain('₹');
    expect(amountEl?.textContent).toContain('987.65'); // The number part
 
     // Change back to non-currency
    component.isCurrency = false;
    fixture.detectChanges();
    expect(amountEl?.textContent?.trim()).toBe('987.65');
  });
});