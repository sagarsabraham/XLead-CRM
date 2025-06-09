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
  messages: ChatMessage[] = [];

  private readonly baseApiUrl = 'https://localhost:7297/api';
  private shouldScrollToBottom = false;

  smartSuggestions = [
    // 'Show me deals created this week',
    // 'Top 5 deals by amount',
    // 'Recent customer contacts',
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
    const welcomeMessage = 'Hello! I\'m your Smart XLeadBot assistant. How can I help you?';
    this.addBotResponse(welcomeMessage);
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
    this.results = []; // Clear previous results immediately
    this.shouldScrollToBottom = true;

    const apiUrl = `${this.baseApiUrl}/aiquery/process-natural-language`;
    this.http.post<AiQueryServerResponse>(apiUrl, { naturalLanguageQuery: prompt })
      .subscribe({
        next: (response) => {
          this.isTyping = false;
          if (response.success) {
            // Keep the full results for potential future use (like re-adding exports)
            this.results = response.results || [];
            // The message from the backend is now the primary content to display
            this.addBotResponse(response.message, response.generatedSql);
          } else {
            this.addBotResponse(`⚠️ ${response.message}`, response.generatedSql);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isTyping = false;
          this.handleApiError(err);
        }
      });
  }

  private async addBotResponse(text: string, sqlQuery?: string): Promise<void> {
    try {
      const parsedHtml = await marked.parse(text);
      this.messages.push({
        id: this.generateMessageId(),
        text,
        parsedText: this.sanitizer.bypassSecurityTrustHtml(parsedHtml),
        timestamp: new Date(),
        isUser: false,
        sqlQuery
      });
      
      this.shouldScrollToBottom = true;
      this.cdr.detectChanges(); // Manually trigger change detection
    } catch (error) {
      console.error('Error parsing markdown:', error);
    }
  }

  private async handleApiError(error: HttpErrorResponse): Promise<void> {
    let errorMessage = `**Oops! An error occurred.**\n\n`;
    if (error.error instanceof ErrorEvent) {
      errorMessage += `A network error prevented the request from completing.`;
    } else {
      errorMessage += `The server responded with a status of **${error.status}**.`;
      if (error.error?.message) {
        errorMessage += `\n\n> *${error.error.message}*`;
      }
    }
    await this.addBotResponse(errorMessage);
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

  autoGrowTextarea(event: any): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    // Set a max height to prevent infinite growth
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }

  // TrackBy functions for *ngFor performance optimization
  trackByMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  trackBySuggestion(index: number, suggestion: string): string {
    return suggestion;
  }
}