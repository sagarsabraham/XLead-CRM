import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatedInfoComponent } from './related-info.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('RelatedInfoComponent', () => {
  let component: RelatedInfoComponent;
  let fixture: ComponentFixture<RelatedInfoComponent>;

  const mockItems = [
    { icon: 'user', text: 'John Doe', isLink: false, isPhone: false },
    { icon: 'email', text: 'john.doe@example.com', isLink: true },
    { icon: 'tel', text: '+1234567890', isPhone: true },
    { icon: 'home', text: 'Test Corp', isLink: false },
    { icon: 'globe', text: 'testcorp.com', isLink: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedInfoComponent],
      schemas: [NO_ERRORS_SCHEMA] // Ignore dx-icon-* classes
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.title).toBe('');
      expect(component.items).toEqual([]);
    });
  });

  describe('Methods', () => {
    describe('getIconName', () => {
      it('should return correct icon name for known keys', () => {
        expect(component.getIconName('user')).toBe('user');
        expect(component.getIconName('email')).toBe('email');
        expect(component.getIconName('tel')).toBe('tel');
        expect(component.getIconName('home')).toBe('home');
        expect(component.getIconName('globe')).toBe('globe');
        expect(component.getIconName('edit')).toBe('edit');
      });

      it('should return help icon for unknown keys', () => {
        expect(component.getIconName('unknown')).toBe('help');
        expect(component.getIconName('')).toBe('help');
      });
    });
  });

  describe('Template Rendering', () => {
    it('should display title correctly', () => {
      component.title = 'Related Contact';
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('.related-info-title')).nativeElement;
      expect(titleElement.textContent.trim()).toBe('Related Contact');
    });

    it('should render no items when items array is empty', () => {
      component.items = [];
      fixture.detectChanges();
      const itemElements = fixture.debugElement.queryAll(By.css('.related-info-item'));
      expect(itemElements.length).toBe(0);
    });

    it('should render items with correct icons and text', () => {
      component.items = mockItems;
      fixture.detectChanges();
      const itemElements = fixture.debugElement.queryAll(By.css('.related-info-item'));
      expect(itemElements.length).toBe(5);

     
      const iconElements = itemElements.map(item => item.query(By.css('.related-info-icon')).nativeElement);
      expect(iconElements[0].className).toContain('dx-icon-user');
      expect(iconElements[1].className).toContain('dx-icon-email');
      expect(iconElements[2].className).toContain('dx-icon-tel');
      expect(iconElements[3].className).toContain('dx-icon-home');
      expect(iconElements[4].className).toContain('dx-icon-globe');

      // Check text content
      const textElements = itemElements.map(item => item.query(By.css('.related-info-text')).nativeElement.textContent.trim());
      expect(textElements).toEqual([
        'John Doe',
        'john.doe@example.com',
        '+1234567890',
        'Test Corp',
        'testcorp.com'
      ]);
    });

    it('should render plain text for items with no link or phone', () => {
      component.items = [{ icon: 'user', text: 'John Doe', isLink: false, isPhone: false }];
      fixture.detectChanges();
      const textElement = fixture.debugElement.query(By.css('.related-info-text')).nativeElement;
      expect(textElement.tagName).toBe('P');
      expect(textElement.textContent.trim()).toBe('John Doe');
    });

    it('should render link for items with isLink true', () => {
      component.items = [{ icon: 'email', text: 'john.doe@example.com', isLink: true }];
      fixture.detectChanges();
      const linkElement = fixture.debugElement.query(By.css('.related-info-text')).nativeElement;
      expect(linkElement.tagName).toBe('A');
      expect(linkElement.getAttribute('href')).toBe('http://john.doe@example.com');
      expect(linkElement.getAttribute('target')).toBe('_blank');
      expect(linkElement.textContent.trim()).toBe('john.doe@example.com');
    });

    it('should render link with http prefix for items starting with http', () => {
      component.items = [{ icon: 'globe', text: 'https://testcorp.com', isLink: true }];
      fixture.detectChanges();
      const linkElement = fixture.debugElement.query(By.css('.related-info-text')).nativeElement;
      expect(linkElement.getAttribute('href')).toBe('https://testcorp.com');
    });

    it('should render phone link for items with isPhone true', () => {
      component.items = [{ icon: 'tel', text: '+1234567890', isPhone: true }];
      fixture.detectChanges();
      const linkElement = fixture.debugElement.query(By.css('.related-info-text')).nativeElement;
      expect(linkElement.tagName).toBe('A');
      expect(linkElement.getAttribute('href')).toBe('tel:+1234567890');
      expect(linkElement.textContent.trim()).toBe('+1234567890');
    });
  });
});