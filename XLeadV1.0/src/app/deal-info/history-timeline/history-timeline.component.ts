import { Component, Input } from '@angular/core';
 
// Define an interface for the history entry
interface HistoryEntry {
  timestamp: string;
  editedBy: string;
  fromStage: string;
  toStage: string;
}
 
@Component({
  selector: 'app-history-timeline',
  templateUrl: './history-timeline.component.html',
  styleUrls: ['./history-timeline.component.css']
})
export class HistoryTimelineComponent {
  @Input() history: HistoryEntry[] = [];
 
  // Group history entries by date
  get groupedHistory(): { date: string; entries: HistoryEntry[] }[] {
    if (!this.history || this.history.length === 0) return [];
 
    const grouped: { date: string; entries: HistoryEntry[] }[] = [];
    let currentDate = '';
    let currentGroup: HistoryEntry[] = [];
 
    // Sort history in descending order (newest first)
    const sortedHistory = this.history.slice().sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
 
    sortedHistory.forEach((item, index) => {
      const date = this.getDateOnly(item.timestamp);
      if (date !== currentDate && index !== 0) {
        grouped.push({ date: currentDate, entries: currentGroup });
        currentGroup = [];
      }
      currentDate = date;
      currentGroup.push(item);
    });
 
    // Push the last group
    if (currentGroup.length > 0) {
      grouped.push({ date: currentDate, entries: currentGroup });
    }
 
    return grouped;
  }
 
  getDateOnly(timestamp: string): string {
    if (!timestamp) return 'Invalid date';
 
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid date';
 
      // Format date to "MMM DD, YYYY" (e.g., "MAY 12, 2025")
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      };
      return date.toLocaleDateString('en-US', options).toUpperCase();
    } catch (e) {
      return 'Invalid date';
    }
  }
 
  getTimeOnly(timestamp: string): string {
    if (!timestamp) return 'Invalid time';
 
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid time';
 
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      return date.toLocaleTimeString('en-US', options);
    } catch (e) {
      return 'Invalid time';
    }
  }
 
  getTodayDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return today.toLocaleDateString('en-US', options);
  }
}