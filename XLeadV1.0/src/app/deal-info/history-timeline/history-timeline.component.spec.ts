import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryTimelineComponent } from './history-timeline.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HistoryTimelineComponent', () => {
  let component: HistoryTimelineComponent;
  let fixture: ComponentFixture<HistoryTimelineComponent>;

  const mockHistory = [
    {
      timestamp: '2025-05-12T14:30:00Z',
      editedBy: 'John Doe',
      fromStage: 'Lead',
      toStage: 'Opportunity'
    },
    {
      timestamp: '2025-05-12T09:15:00Z',
      editedBy: 'Jane Smith',
      fromStage: 'Prospect',
      toStage: 'Lead'
    },
    {
      timestamp: '2025-05-11T16:45:00Z',
      editedBy: 'Alice Johnson',
      fromStage: 'Initial',
      toStage: 'Prospect'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryTimelineComponent],
      schemas: [NO_ERRORS_SCHEMA] // Ignore dx-card class
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty history array', () => {
      expect(component.history).toEqual([]);
    });
  });

  describe('Computed Properties', () => {
    describe('groupedHistory', () => {
      it('should return empty array when history is empty', () => {
        component.history = []; // Changed from undefined
        expect(component.groupedHistory).toEqual([]);
      });

      it('should group history entries by date in descending order', () => {
        component.history = mockHistory;
        const expected = [
          {
            date: 'MAY 12, 2025',
            entries: [
              mockHistory[0], // 14:30
              mockHistory[1]  // 09:15
            ]
          },
          {
            date: 'MAY 11, 2025',
            entries: [mockHistory[2]] // 16:45
          }
        ];
        expect(component.groupedHistory).toEqual(expected);
      });

      it('should handle invalid timestamps gracefully', () => {
        component.history = [
          {
            timestamp: 'invalid',
            editedBy: 'John Doe',
            fromStage: 'Lead',
            toStage: 'Opportunity'
          }
        ];
        expect(component.groupedHistory).toEqual([
          {
            date: 'Invalid date',
            entries: [component.history[0]]
          }
        ]);
      });
    });
  });

  describe('Methods', () => {
    describe('getDateOnly', () => {
      it('should format valid timestamp to MMM DD, YYYY', () => {
        const timestamp = '2025-05-12T14:30:00Z';
        expect(component.getDateOnly(timestamp)).toBe('MAY 12, 2025');
      });

      it('should return Invalid date for empty or invalid timestamp', () => {
        expect(component.getDateOnly('')).toBe('Invalid date');
        expect(component.getDateOnly('invalid')).toBe('Invalid date');
      });
    });

    describe('getTimeOnly', () => {
      it('should format valid timestamp to hour:minute AM/PM', () => {
        const timestamp = '2025-05-12T14:30:00Z';
        const time = component.getTimeOnly(timestamp);
        // Adjust for local timezone; UTC 14:30 may vary (e.g., 10:30 AM EDT)
        expect(time).toMatch(/^\d{1,2}:\d{2}\s[AP]M$/); // e.g., "2:30 PM"
      });

      it('should return Invalid time for empty or invalid timestamp', () => {
        expect(component.getTimeOnly('')).toBe('Invalid time');
        expect(component.getTimeOnly('invalid')).toBe('Invalid time');
      });
    });

    describe('getTodayDate', () => {
      it('should return today’s date in Month DD, YYYY format', () => {
        const today = new Date();
        const expected = today.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        expect(component.getTodayDate()).toBe(expected);
      });
    });
  });

  describe('Template Rendering', () => {
    it('should display no history message when history is empty', () => {
      component.history = [];
      fixture.detectChanges();
      const noHistory = fixture.debugElement.query(By.css('.no-history')).nativeElement;
      expect(noHistory.textContent.trim()).toBe('No stage history available.');
      const timeline = fixture.debugElement.query(By.css('.timeline'));
      expect(timeline).toBeNull();
    });

    it('should render timeline groups when history is provided', () => {
      component.history = mockHistory;
      fixture.detectChanges();
      const timelineGroups = fixture.debugElement.queryAll(By.css('.timeline-group'));
      expect(timelineGroups.length).toBe(2); // Two dates: May 12, May 11
      const dateTexts = timelineGroups.map(group => group.query(By.css('.date-text')).nativeElement.textContent.trim());
      expect(dateTexts).toEqual(['MAY 12, 2025', 'MAY 11, 2025']);
    });

    it('should render timeline entries with correct details', () => {
      component.history = [mockHistory[0]];
      fixture.detectChanges();
      const entry = fixture.debugElement.query(By.css('.timeline-entry'));
      const time = entry.query(By.css('.timeline-time')).nativeElement.textContent.trim();
      const userAction = entry.query(By.css('.user-action')).nativeElement.textContent.trim();
      const stageChange = entry.query(By.css('.stage-change')).nativeElement.textContent.trim();
      expect(time).toMatch(/^\d{1,2}:\d{2}\s[AP]M$/); // e.g., "2:30 PM"
      expect(userAction).toBe('Stage updated by John Doe');
      expect(stageChange).toBe('Lead to Opportunity');
    });

    it('should apply active class to first entry’s dot', () => {
      component.history = mockHistory;
      fixture.detectChanges();
      const dots = fixture.debugElement.queryAll(By.css('.timeline-dot .dot'));
      expect(dots[0].classes['active']).toBeTrue(); // First entry
      expect(dots[1].classes['active']).toBeUndefined(); // Second entry
    });

    it('should render line for non-last entries', () => {
      component.history = mockHistory;
      fixture.detectChanges();
      const entries = fixture.debugElement.queryAll(By.css('.timeline-entry'));
      const lineInFirst = entries[0].query(By.css('.line'));
      const lineInLast = entries[2].query(By.css('.line'));
      expect(lineInFirst).toBeTruthy(); // First entry has line
      expect(lineInLast).toBeNull(); // Last entry has no line
    });
  });
});