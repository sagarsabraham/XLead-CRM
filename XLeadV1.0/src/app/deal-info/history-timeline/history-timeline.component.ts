import { Component, Input } from '@angular/core';
 
interface HistoryEntry {
  timestamp: string;
  editedBy: string;
  fromStage: string;
  toStage: string;
  isInitial?: boolean;
}
 
export interface TimelineDisplayEntry {
  timestamp: string;
  editedByUserId: number;
  editedByUserName?: string;
  fromStage: string;
  toStage: string;
  isInitial?: boolean;
}
 
@Component({
  selector: 'app-history-timeline',
  templateUrl: './history-timeline.component.html',
  styleUrls: ['./history-timeline.component.css']
})
export class HistoryTimelineComponent {
  @Input() history: HistoryEntry[] = [];
 
  get groupedHistory(): { date: string; entries: HistoryEntry[] }[] {
    if (!this.history || this.history.length === 0) return [];
 
    const grouped: { date: string; entries: HistoryEntry[] }[] = [];
    let currentDate = '';
    let currentGroup: HistoryEntry[] = [];
 
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
 
    if (currentGroup.length > 0) {
      grouped.push({ date: currentDate, entries: currentGroup });
    }
 
    return grouped;
  }
 
  getDateOnly(timestamp: string): string {
    if (!timestamp) return 'Invalid date';
 
    try {
      // Ensure the timestamp is treated as UTC by appending 'Z' if no timezone is specified
      const utcTimestamp = timestamp.endsWith('Z') ? timestamp : `${timestamp}Z`;
      const date = new Date(utcTimestamp);
      if (isNaN(date.getTime())) return 'Invalid date';
 
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Use user's local timezone
      };
      return date.toLocaleDateString('en-US', options).toUpperCase();
    } catch (e) {
      console.error('Error parsing date:', e);
      return 'Invalid date';
    }
  }
 
  getTimeOnly(timestamp: string): string {
    if (!timestamp) return 'Invalid time';
 
    try {
      // Ensure the timestamp is treated as UTC by appending 'Z' if no timezone is specified
      const utcTimestamp = timestamp.endsWith('Z') ? timestamp : `${timestamp}Z`;
      const date = new Date(utcTimestamp);
      if (isNaN(date.getTime())) return 'Invalid time';
 
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Use user's local timezone
      };
      return date.toLocaleTimeString('en-US', options);
    } catch (e) {
      console.error('Error parsing time:', e);
      return 'Invalid time';
    }
  }
 
  getTodayDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    return today.toLocaleDateString('en-US', options);
  }
}