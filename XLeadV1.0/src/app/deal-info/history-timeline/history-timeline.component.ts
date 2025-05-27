import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-history-timeline',
  templateUrl: './history-timeline.component.html',
  styleUrls: ['./history-timeline.component.css']
})
export class HistoryTimelineComponent {
  @Input() history: { timestamp: string; editedBy: string; fromStage: string; toStage: string }[] = [];

    get reversedHistory() {
    return this.history
      .slice()
      .reverse()
      .map(item => ({
        ...item,
        // timestamp stays exactly the same, no conversion
        timestamp: item.timestamp
      }));
  }
getTimeOnly(timestamp: string): string {
  if (!timestamp) return 'Invalid time';

  // Match formats like "11:06:49 am" or "11:06 am"
  const match = timestamp.match(/\d{1,2}:\d{2}(?::\d{2})?\s?[ap]m/i);
  if (match) {
    const timeStr = match[0];
    
    // Optionally remove seconds (e.g., "11:06:49 am" → "11:06 am")
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hours = parts[0];
      const minutes = parts[1];
      const ampm = timeStr.toLowerCase().includes('pm') ? 'pm' : 'am';
      return `${hours}:${minutes} ${ampm}`;
    }
  }

  // Handle simple "HH:mm" format
  if (/^\d{1,2}:\d{2}$/.test(timestamp)) {
    return timestamp;
  }

  return 'Invalid time';
}





  getTodayDate(): string {
    const today = new Date();
    
    // Format: "April 18, 2025"
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return today.toLocaleDateString('en-US', options);
  }
}

