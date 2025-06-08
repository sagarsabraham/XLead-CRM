import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DealInfoCardComponent } from './deal-info-card.component';
import { NO_ERRORS_SCHEMA, Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-related-info',
  template: ''
})
class MockRelatedInfoComponent {
  @Input() title!: string; 
  @Input() items!: any[]; 
}

@Component({
  selector: 'app-description',
  template: ''
})
class MockDescriptionComponent {
  @Input() description!: string; 
  @Output() descriptionChange = new EventEmitter<string>();
}

describe('DealInfoCardComponent', () => {
  let component: DealInfoCardComponent;
  let fixture: ComponentFixture<DealInfoCardComponent>;

  const mockDeal = {
    contactName: 'John Doe',
    contactEmail: 'john.doe@example.com',
    contactPhone: '+1234567890',
    companyName: 'Test Corp',
    companyWebsite: 'info@testcorp.com',
    companyPhone: '+0987654321',
    description: 'Test deal description'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DealInfoCardComponent,
        MockRelatedInfoComponent,
        MockDescriptionComponent
      ],

    }).compileComponents();

    fixture = TestBed.createComponent(DealInfoCardComponent);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with undefined deal and descriptionChange emitter', () => {
      expect(component.deal).toBeUndefined();
      expect(component.descriptionChange).toBeInstanceOf(EventEmitter);
    });
  });

  describe('Computed Properties', () => {
    describe('contactItems', () => {
      it('should return empty array when deal is undefined', () => {
        expect(component.contactItems).toEqual([]);
      });

      it('should return contact items when deal is provided', () => {
        component.deal = mockDeal;
        expect(component.contactItems).toEqual([
          { icon: 'user', text: 'John Doe', isLink: false },
          { icon: 'email', text: 'john.doe@example.com', isLink: true },
          { icon: 'tel', text: '+1234567890', isPhone: true }
        ]);
      });

      it('should handle missing contact fields with N/A', () => {
        component.deal = { ...mockDeal, contactName: '', contactEmail: null, contactPhone: undefined };
        expect(component.contactItems).toEqual([
          { icon: 'user', text: 'N/A', isLink: false },
          { icon: 'email', text: 'N/A', isLink: true },
          { icon: 'tel', text: 'N/A', isPhone: true }
        ]);
      });
    });

    describe('companyItems', () => {
      it('should return empty array when deal is undefined', () => {
        expect(component.companyItems).toEqual([]);
      });

      it('should return company items when deal is provided', () => {
        component.deal = mockDeal;
        expect(component.companyItems).toEqual([
          { icon: 'home', text: 'Test Corp', isLink: false },
          { icon: 'globe', text: 'testcorp.com', isLink: true },
          { icon: 'tel', text: '+0987654321', isPhone: true }
        ]);
      });

      it('should handle missing company fields with N/A', () => {
        component.deal = { ...mockDeal, companyName: '', companyWebsite: null, companyPhone: undefined };
        expect(component.companyItems).toEqual([
          { icon: 'home', text: 'N/A', isLink: false },
          { icon: 'globe', text: 'N/A', isLink: true },
          { icon: 'tel', text: 'N/A', isPhone: true }
        ]);
      });

      it('should format company website correctly', () => {
        component.deal = { ...mockDeal, companyWebsite: 'info@company.com' };
        const companyItems = component.companyItems;
        expect(companyItems[1].text).toEqual('company.com');
      });
    });

    describe('dealDescription', () => {
      it('should return deal description when deal is provided', () => {
        component.deal = mockDeal;
        expect(component.dealDescription).toEqual('Test deal description');
      });

      it('should return default message when deal or description is missing', () => {
        expect(component.dealDescription).toEqual('No description available.');
        component.deal = {};
        expect(component.dealDescription).toEqual('No description available.');
      });
    });
  });

  describe('Event Emission', () => {
    it('should emit descriptionChange event when onDescriptionChange is called', () => {
      const newDescription = 'Updated description';
      let emittedDescription: string | undefined;
      component.descriptionChange.subscribe((value: string) => {
        emittedDescription = value;
      });
      component.onDescriptionChange(newDescription);
      expect(emittedDescription).toEqual(newDescription);
    });
  });

  describe('Template Rendering', () => {
    it('should render two related-info components with correct titles', () => {
      fixture.detectChanges();
      const relatedInfoComponents = fixture.debugElement.queryAll(By.css('app-related-info'));
      expect(relatedInfoComponents.length).toBe(2);
      expect(relatedInfoComponents[0].componentInstance.title).toBe('Related Contact');
      expect(relatedInfoComponents[1].componentInstance.title).toBe('Related Customer');
    });

    it('should pass contactItems to Related Contact component', () => {
      component.deal = mockDeal;
      fixture.detectChanges();
      const relatedInfoComponent = fixture.debugElement.queryAll(By.css('app-related-info'))[0];
      expect(relatedInfoComponent.componentInstance.items).toEqual([
        { icon: 'user', text: 'John Doe', isLink: false },
        { icon: 'email', text: 'john.doe@example.com', isLink: true },
        { icon: 'tel', text: '+1234567890', isPhone: true }
      ]);
    });

    it('should pass companyItems to Related Customer component', () => {
      component.deal = mockDeal;
      fixture.detectChanges();
      const relatedInfoComponent = fixture.debugElement.queryAll(By.css('app-related-info'))[1];
      expect(relatedInfoComponent.componentInstance.items).toEqual([
        { icon: 'home', text: 'Test Corp', isLink: false },
        { icon: 'globe', text: 'testcorp.com', isLink: true },
        { icon: 'tel', text: '+0987654321', isPhone: true }
      ]);
    });

    it('should pass description to app-description component', () => {
      component.deal = mockDeal;
      fixture.detectChanges();
      const descriptionComponent = fixture.debugElement.query(By.css('app-description'));
      expect(descriptionComponent.componentInstance.description).toBe('Test deal description');
    });

    it('should handle descriptionChange event from app-description', () => {
      spyOn(component, 'onDescriptionChange');
      component.deal = mockDeal;
      fixture.detectChanges();
      const descriptionComponent = fixture.debugElement.query(By.css('app-description'));
      descriptionComponent.componentInstance.descriptionChange.emit('New description');
      expect(component.onDescriptionChange).toHaveBeenCalledWith('New description');
    });
  });
});