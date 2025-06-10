import { Component, AfterViewChecked, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiResponse } from '../models/api-response.model'; 


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

  isCollapsed = true; // Start collapsed by default
  userInput: string = '';
  isTyping: boolean = false;
  results: any[] = [];
  queryHistory: string[] = [];
  messages: ChatMessage[] = [];

  private readonly baseApiUrl = 'https://localhost:7297/api';
  private shouldScrollToBottom = false;

  smartSuggestions = [];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadQueryHistory();
    this.configureMarked();
    this.addInitialMessage();
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
    const welcomeMessage = 'Hello! I\'m your Smart assistant. How can I help you today?';
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
      }, 300);
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
    this.results = [];
    this.shouldScrollToBottom = true;

    const apiUrl = `${this.baseApiUrl}/aiquery/process-natural-language`;
    this.http.post<ApiResponse<AiQueryServerResponse>>(apiUrl, { naturalLanguageQuery: prompt })
      .subscribe({
        next: (wrappedResponse: ApiResponse<AiQueryServerResponse>) => {
          console.log('Raw Wrapped API Response received in FE:', JSON.stringify(wrappedResponse, null, 2));
          this.isTyping = false;

          // Check if the response conforms to the expected ApiResponse structure
          if (wrappedResponse && typeof wrappedResponse.success === 'boolean') {
            if (wrappedResponse.success && wrappedResponse.data) {
              // Outer API call was successful and data (AiQueryServerResponse) is present
              const aiResponse = wrappedResponse.data;

              // Now check the success status from the AI processing logic
              if (aiResponse.success) {
                this.results = aiResponse.results || [];
                this.addBotResponse(aiResponse.message, aiResponse.generatedSql);
              } else {
                // AI processing failed, use its message
                this.addBotResponse(`⚠️ ${aiResponse.message || 'The AI could not process your request.'}`, aiResponse.generatedSql);
              }
            } else {
              // Outer API call indicated failure (wrappedResponse.success is false),
              // or success was true but data was missing.
              const errorMessage = wrappedResponse.message || 'Failed to process the request on the server or data was missing.';
              this.addBotResponse(`⚠️ ${errorMessage}`);
              console.warn('API call was not successful or data was missing in wrapped response:', wrappedResponse);
            }
          } else {
            // The response object does not look like our ApiResponse<T>
            console.error('Received malformed API response:', wrappedResponse);
            this.addBotResponse('⚠️ Received an unexpected response format from the server.');
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
      // Ensure text is a string, defaulting to empty if null/undefined to avoid marked.parse error
      const messageText = text || '';
      console.log(`[ChatbotComponent] addBotResponse called with text: "${messageText}"`);
      const parsedHtml = await marked.parse(messageText);
      this.messages.push({
        id: this.generateMessageId(),
        text: messageText,
        parsedText: this.sanitizer.bypassSecurityTrustHtml(parsedHtml),
        timestamp: new Date(),
        isUser: false,
        sqlQuery
      });

      this.shouldScrollToBottom = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error parsing markdown:', error, 'Original text was:', text);
      // Fallback for safety, display raw text if markdown parsing fails
       this.messages.push({
        id: this.generateMessageId(),
        text: `Error displaying message: ${text || '(empty message)'}`,
        parsedText: this.sanitizer.bypassSecurityTrustHtml(`Error displaying message. Please check console.`),
        timestamp: new Date(),
        isUser: false,
        sqlQuery
      });
      this.shouldScrollToBottom = true;
      this.cdr.detectChanges();
    }
  }

  private async handleApiError(error: HttpErrorResponse): Promise<void> {
    console.error('Full API HttpErrorResponse in handleApiError:', JSON.stringify(error, null, 2));
    let userFriendlyMessage = `**Oops! An error occurred.**\n\n`;

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      userFriendlyMessage += `A network error prevented the request from completing. Please check your connection.`;
    } else {
      // The backend returned an unsuccessful response code.
      userFriendlyMessage += `The server responded with a status of **${error.status}**.`;

      // Attempt to parse error.error as ApiResponse<any>
      const errorResponse = error.error as ApiResponse<any>;
      if (errorResponse && typeof errorResponse.success === 'boolean' && errorResponse.message) {
        // We have a structured error message from our ApiResponse wrapper
        userFriendlyMessage += `\n\n> *${errorResponse.message}*`;
      } else if (typeof error.error === 'string' && error.error.length > 0 && error.error.length < 500) { // Check for simple string error
         userFriendlyMessage += `\n\n> *${error.error}*`;
      } else if (error.message) {
        // Fallback to the HttpErrorResponse's message property (can be generic)
        userFriendlyMessage += `\n\n> *${error.message}*`;
      } else {
        userFriendlyMessage += `\n\nAn unknown server error occurred.`;
      }
    }
    await this.addBotResponse(userFriendlyMessage);
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
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }

  trackByMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  trackBySuggestion(index: number, suggestion: string): string {
    return suggestion;
  }
}