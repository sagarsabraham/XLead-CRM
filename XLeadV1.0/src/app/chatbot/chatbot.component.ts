import { Component, AfterViewChecked, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Interfaces
interface AiQueryServerResponse {
  message: string;
  results?: any[];
  generatedSql?: string;
  count?: number;
  success: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  parsedText?: SafeHtml;
  timestamp: Date;
  isUser: boolean;
  sqlQuery?: string;
}

// Enums
enum QueryType {
  GENERAL = 'general',
  AI_QUERY = 'ai_query'
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked, OnInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  isCollapsed = false;
  userInput: string = '';
  isTyping: boolean = false;
  results: any[] = [];
  queryHistory: string[] = [];
  showResultsSkeleton = false;
  messages: ChatMessage[] = [];

  private readonly baseApiUrl = 'https://localhost:7297/api';
  private shouldScrollToBottom = false;

  smartSuggestions = [
    'Show me deals created this week',
    'Top 5 deals by amount',
    'Recent customer contacts',
  ];

  constructor(
    private http: HttpClient, 
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadQueryHistory();
    this.configureMarked();
    this.addInitialMessage();
    
    // Focus input after view initialization
    setTimeout(() => {
      if (this.messageInput?.nativeElement) {
        this.messageInput.nativeElement.focus();
      }
    }, 100);
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private configureMarked(): void {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
  }

  private addInitialMessage(): void {
    const welcomeMessage = 'Hello! I\'m your Smart XLeadBot assistant. How can I help you with your XLead data today?';
    this.messages.push({
      id: this.generateMessageId(),
      text: welcomeMessage,
      timestamp: new Date(),
      isUser: false,
      parsedText: this.sanitizer.bypassSecurityTrustHtml(welcomeMessage)
    });
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private scrollToBottom(): void {
    if (this.messagesContainer?.nativeElement) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    if (!this.isCollapsed) {
      setTimeout(() => {
        if (this.messageInput?.nativeElement) {
          this.messageInput.nativeElement.focus();
        }
      }, 100);
    }
  }

  clearChat(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.messages = [];
    this.results = [];
    this.addBotResponse('Chat cleared. How can I assist you now?');
  }

  onInputChange(): void {
    // Placeholder for future input change handling
  }

  sendMessage(): void {
    const messageText = this.userInput.trim();
    if (!messageText || this.isTyping) return;

    this.addUserMessage(messageText);
    this.addToHistory(messageText);
    this.processWithAi(messageText);

    this.userInput = '';
    this.autoGrowTextarea({ target: this.messageInput.nativeElement });
  }

  sendQuickAction(query: string): void {
    if (this.isTyping) return;
    this.addUserMessage(query);
    this.addToHistory(query);
    this.processWithAi(query);
  }

  private addUserMessage(text: string): void {
    this.messages.push({
      id: this.generateMessageId(),
      text: text,
      timestamp: new Date(),
      isUser: true,
    });
    this.shouldScrollToBottom = true;
  }

  private processWithAi(prompt: string): void {
    this.isTyping = true;
    this.showResultsSkeleton = true;
    this.results = [];
    this.shouldScrollToBottom = true;

    const apiUrl = `${this.baseApiUrl}/aiquery/process-natural-language`;
    this.http.post<AiQueryServerResponse>(apiUrl, { naturalLanguageQuery: prompt })
      .subscribe({
        next: (response) => {
          this.isTyping = false;
          this.showResultsSkeleton = false;

          if (response.success) {
            let botText = response.message;
            if (response.results && response.results.length > 0) {
              botText = `Found ${response.count} record(s). Here's a preview:\n\n` + this.formatAiResults(response.results);
              this.results = response.results;
            }
            this.addBotResponse(botText, response.generatedSql);
          } else {
            this.addBotResponse(`⚠️ ${response.message}`, response.generatedSql);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isTyping = false;
          this.showResultsSkeleton = false;
          this.handleApiError(err);
        }
      });
  }

  private async addBotResponse(text: string, sqlQuery?: string): Promise<void> {
    try {
      const parsedHtml = await marked.parse(text);
      const sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(parsedHtml);

      this.messages.push({
        id: this.generateMessageId(),
        text,
        parsedText: sanitizedHtml,
        timestamp: new Date(),
        isUser: false,
        sqlQuery
      });
      
      this.shouldScrollToBottom = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error parsing markdown:', error);
      // Fallback to plain text
      this.messages.push({
        id: this.generateMessageId(),
        text,
        parsedText: this.sanitizer.bypassSecurityTrustHtml(text),
        timestamp: new Date(),
        isUser: false,
        sqlQuery
      });
      this.shouldScrollToBottom = true;
    }
  }

  private async handleApiError(error: HttpErrorResponse): Promise<void> {
    let errorMessage = `**Oops! I encountered a problem.**\n\n`;
    
    if (error.error instanceof ErrorEvent) {
      errorMessage += `A network error occurred. Please check your connection.`;
    } else {
      errorMessage += `The server responded with a status of **${error.status}**.`;
      if (error.error?.message) {
        errorMessage += `\n\n> ${error.error.message}`;
      }
    }
    
    errorMessage += '\n\n*Please try rephrasing your query or contact support if the issue persists.*';
    await this.addBotResponse(errorMessage);
  }

  private formatAiResults(data: any[]): string {
    let formatted = '';
    const maxResultsToDisplay = 5;
    const resultsToDisplay = data.slice(0, maxResultsToDisplay);

    for (const row of resultsToDisplay) {
      formatted += `- **Record:**\n`;
      Object.keys(row).forEach(key => {
        let value = row[key];
        if (value === null || value === undefined) {
          value = '_(null)_';
        } else if (typeof value === 'number' && (key.toLowerCase().includes('amount') || key.toLowerCase().includes('price'))) {
          value = this.formatCurrency(value);
        }
        formatted += `  - **${key}:** ${value}\n`;
      });
    }

    if (data.length > maxResultsToDisplay) {
      formatted += `\n...and ${data.length - maxResultsToDisplay} more record(s).`;
    }
    return formatted;
  }

  private addToHistory(query: string): void {
    if (!this.queryHistory.includes(query)) {
      this.queryHistory.unshift(query);
      if (this.queryHistory.length > 20) this.queryHistory.pop();
      this.saveQueryHistory();
    }
  }

  private saveQueryHistory(): void {
    try {
      localStorage.setItem('chatbotQueryHistory', JSON.stringify(this.queryHistory));
    } catch (error) {
      console.warn('Failed to save query history:', error);
    }
  }

  private loadQueryHistory(): void {
    try {
      const history = localStorage.getItem('chatbotQueryHistory');
      this.queryHistory = history ? JSON.parse(history) : [];
    } catch (error) {
      console.warn('Failed to load query history:', error);
      this.queryHistory = [];
    }
  }

  onInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else if (event.key === 'ArrowUp' && this.queryHistory.length > 0 && this.userInput === '') {
      event.preventDefault();
      this.userInput = this.queryHistory[0];
    }
  }

  getTimeString(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private formatCurrency(amount: any): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(Number(amount));
  }

  autoGrowTextarea(event: any): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }

  exportResults(format: 'json' | 'csv'): void {
    if (!this.results || this.results.length === 0) {
      this.addBotResponse('❌ No results to export.');
      return;
    }
    
    if (format === 'json') {
      this.downloadJSON();
    } else {
      this.downloadCSV();
    }
  }

  private downloadJSON(): void {
    this.downloadFile(
      JSON.stringify(this.results, null, 2), 
      'application/json', 
      'json'
    );
    this.addBotResponse('📁 **Export Complete:** JSON file downloaded successfully.');
  }

  private downloadCSV(): void {
    if (this.results.length === 0) return;
    
    const headers = Object.keys(this.results[0]);
    const csvRows = [
      headers.join(','),
      ...this.results.map(row =>
        headers.map(header => {
          const value = row[header] ?? '';
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
      )
    ];
    
    this.downloadFile(csvRows.join('\n'), 'text/csv;charset=utf-8;', 'csv');
    this.addBotResponse('📁 **Export Complete:** CSV file downloaded successfully.');
  }

  private downloadFile(content: string, mimeType: string, extension: string): void {
    try {
      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `xlead-ai-results-${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading file:', error);
      this.addBotResponse('❌ Failed to download file. Please try again.');
    }
  }

  // TrackBy functions for performance optimization
  trackByMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  trackBySuggestion(index: number, suggestion: string): string {
    return suggestion;
  }
}