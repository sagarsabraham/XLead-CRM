import { Component, AfterViewChecked, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core'; 
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 

interface AiQueryServerResponse {
  message: string;        
  results?: any[];        
  generatedSql?: string;  
  count?: number;        
  success: boolean;       
}

interface ChatMessage {
  text: string;
  timestamp: Date;
  isUser: boolean;
  queryType?: QueryType;
  hasResults?: boolean;
  sqlQuery?: string; 
}

interface QueryResponse { 
  sql: string;
  result?: any[];
  deals?: any[];
  count?: number;
  message?: string;
  error?: string;
}

enum QueryType {
  COUNT = 'count',
  RECENT = 'recent',
  FILTER = 'filter',
  SORT = 'sort',
  ALL = 'all', 
  TEST = 'test',
  GENERAL = 'general', 
  AI_QUERY = 'ai_query' 
}

interface QueryPattern {
  type: QueryType;
  patterns: RegExp[];
  description: string;
  examples: string[];
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked, OnInit { 
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  isCollapsed = true;
  userInput: string = '';
  isTyping: boolean = false;
  results: any[] = []; 
  showSuggestions = false;
  suggestions: string[] = [];
  queryHistory: string[] = [];
  showResultsSkeleton = false;

  private readonly legacyBaseApiUrl = 'https://localhost:7297/api/count';
  private readonly aiQueryApiUrl = 'https://localhost:7297/api/aiquery/process-natural-language'; 


  private queryPatterns: QueryPattern[] = [
    {
      type: QueryType.COUNT,
      patterns: [/count|how many|total|number of/i],
      description: 'Count queries',
      examples: ['count all deals', 'how many closed deals', 'total deals this month']
    },
    {
      type: QueryType.RECENT, 
      patterns: [/recent deals|latest deals|new deals/i],
      description: 'Recent data queries',
      examples: ['recent deals']
    },
  
    {
      type: QueryType.TEST,
      patterns: [/test connect|test database|db health|ping db/i], 
      description: 'System testing',
      examples: ['test database connection', 'check db health']
    },
    {
      type: QueryType.ALL,
      patterns: [/^show all deals$/i, /^list all deals$/i, /^all deals$/i],
      description: 'Show all deals',
      examples: ['show all deals']
    }
  ];


  messages: ChatMessage[] = []; 

  smartSuggestions = [
    'Show me deals created this week',
    'Top 5 deals by amount',
    'Count all opportunities',
    'Deals in negotiation stage',
    'How many contacts are in London?',
    'What are the email addresses of leads from "TechCorp"?',
    'List customers in the "Electronics" industry.'
  ];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.loadQueryHistory();
    this.messages.push({
      text: 'Hello! I\'m your Smart XBot assistant. How can I help you with your XLead data today?',
      timestamp: new Date(),
      isUser: false
    });
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer?.nativeElement) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    if (!this.isCollapsed) {
      setTimeout(() => {
        this.messageInput?.nativeElement?.focus();
      }, 100);
    }
  }

  clearChat() {
    this.messages = [
      {
        text: 'Chat cleared. How can I assist you with your XLead data?',
        timestamp: new Date(),
        isUser: false
      }
    ];
    this.results = []; 
  }

  onInputChange() {
    if (this.userInput.trim().length > 2) {
      this.suggestions = this.getSuggestions(this.userInput.trim());
      this.showSuggestions = this.suggestions.length > 0;
    } else {
      this.showSuggestions = false;
    }
  }

  selectSuggestion(suggestion: string) {
    this.userInput = suggestion;
    this.showSuggestions = false;
    this.sendMessage();
  }

  sendMessage() {
    const messageText = this.userInput.trim();
    if (!messageText || this.isTyping) return;

    const queryType = this.parseQuery(messageText);

    this.messages.push({
      text: messageText,
      timestamp: new Date(),
      isUser: true,
      queryType
    });

    this.addToHistory(messageText);
    this.userInput = '';
    this.isTyping = true;
    this.showSuggestions = false;
    this.showResultsSkeleton = true; 

    this.handleUserInput(messageText, queryType);
  }

  sendQuickAction(query: string) {
    if (this.isTyping) return;

    const queryType = this.parseQuery(query);
    this.messages.push({
      text: query,
      timestamp: new Date(),
      isUser: true,
      queryType
    });

    this.addToHistory(query);
    this.isTyping = true;
    this.showResultsSkeleton = true;
    this.handleUserInput(query, queryType);
  }

  private parseQuery(input: string): QueryType {
    const lowerInput = input.toLowerCase();

    for (const pattern of this.queryPatterns) {
      for (const regex of pattern.patterns) {
        if (regex.test(lowerInput)) {
          return pattern.type;
        }
      }
    }
    return QueryType.GENERAL;
  }

  private handleUserInput(input: string, queryType: QueryType) {
    const lowerInput = input.toLowerCase();

    console.log(`Handling input: "${input}", QueryType: ${queryType}`);

    switch (queryType) {
      case QueryType.TEST:
        this.testDatabaseConnection(); 
        break;
      case QueryType.ALL:
        this.getLegacyAllDeals(); 
        break;
      case QueryType.RECENT: 
        this.getLegacyRecentDeals();
        break;
      case QueryType.COUNT: 
        if (lowerInput.includes('closed won')) {
            this.getLegacyClosedWonCount();
        } else {
            
            this.processWithAi(input);
        }
        break;
      case QueryType.GENERAL:
      case QueryType.AI_QUERY:
      case QueryType.FILTER:   
      case QueryType.SORT:    
      default:
        this.processWithAi(input);
        break;
    }
  }

  private processWithAi(prompt: string) {
    this.http.post<AiQueryServerResponse>(this.aiQueryApiUrl, { naturalLanguageQuery: prompt })
      .subscribe({
        next: (response) => {
          this.isTyping = false;
          this.showResultsSkeleton = false;
          let botText = '';

          if (response.success && response.results && response.results.length > 0) {
            botText = this.formatAiResults(response.results, response.generatedSql, response.count);
            this.addBotResponse(botText, true, response.generatedSql);
            this.results = response.results;
          } else if (response.success && (!response.results || response.results.length === 0)) {
            botText = `✅ ${response.message || 'Query executed successfully, but no matching records were found.'}`;
            if (response.generatedSql) {
              botText += `\n\n🔍 SQL: \`${response.generatedSql}\``;
            }
            this.addBotResponse(botText, false, response.generatedSql);
            this.results = [];
          }
          else { 
            botText = `⚠️ ${response.message || 'I could not retrieve the data for your query.'}`;
             if (response.generatedSql) {
              botText += `\n\nAttempted SQL: \`${response.generatedSql}\``;
            }
            this.addBotResponse(botText, false, response.generatedSql);
            this.results = [];
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isTyping = false;
          this.showResultsSkeleton = false;
          this.handleApiError(err, prompt);
          this.results = [];
        }
      });
  }

  private addBotResponse(text: string, hasResults: boolean = false, sqlQuery?: string) {
    this.messages.push({
      text,
      timestamp: new Date(),
      isUser: false,
      hasResults,
      sqlQuery
    });
  }

  private handleApiError(error: HttpErrorResponse, queryContext?: string) {
    let errorMessage = `❌ Oops! I encountered a problem processing your request${queryContext ? ' for: "' + queryContext + '"' : ''}.\n\n`;

    if (error.error instanceof ErrorEvent) {
      errorMessage += `Network/Client Error: ${error.error.message}`;
    } else {
      errorMessage += `Server Error (Status: ${error.status}):\n`;
      if (error.error && typeof error.error.message === 'string') {
        errorMessage += error.error.message; 
      } else if (typeof error.error === 'string' && error.error.length < 200) { 
        errorMessage += error.error;
      } else if (error.statusText) {
        errorMessage += error.statusText;
      } else {
        errorMessage += "The server didn't provide specific details.";
      }
    }

    errorMessage += '\n\n💡 *Please try rephrasing your query, or check the server logs if the problem persists.*';
    this.addBotResponse(errorMessage, false);
  }


  private getLegacyAllDeals() {
    this.http.post<QueryResponse>(`${this.legacyBaseApiUrl}`, { prompt: 'deals' }).subscribe({
      next: (response) => this.handleLegacyResponse(response, 'All Deals'),
      error: (err: HttpErrorResponse) => this.handleApiError(err, 'fetching all deals (legacy)')
    });
  }

  private getLegacyRecentDeals() {
    this.http.get<any[]>(`${this.legacyBaseApiUrl}/RecentDeals`).subscribe({ 
        next: (deals) => {
            this.isTyping = false;
            this.showResultsSkeleton = false;
            if (deals && deals.length > 0) {
                const formatted = this.formatDeals(deals); 
                this.addBotResponse(formatted, true);
                this.results = deals;
            } else {
                this.addBotResponse('📊 No recent deals found (legacy).', false);
            }
        },
        error: (err: HttpErrorResponse) => this.handleApiError(err, 'fetching recent deals (legacy)')
    });
  }


  private getLegacyClosedWonCount() {
    this.http.get<{ closedWonCount: number }>(`${this.legacyBaseApiUrl}/ClosedWonCount`).subscribe({
      next: (response) => {
        this.isTyping = false;
        this.showResultsSkeleton = false;
        const message = `🎯 **Closed Won Deals Count (Legacy)**\n\n**Total:** ${response.closedWonCount} deals`;
        this.addBotResponse(message, true);
        this.results = [{ 'Closed Won Count': response.closedWonCount }];
      },
      error: (err: HttpErrorResponse) => this.handleApiError(err, 'fetching closed won count (legacy)')
    });
  }

  private testDatabaseConnection() {
    this.http.get<any>(`${this.legacyBaseApiUrl}/TestDatabase`).subscribe({ 
        next: (response) => {
            this.isTyping = false;
            this.showResultsSkeleton = false;
            let message = `✅ **Database Connection Test (Legacy)**\n\n${response.message}\n`;
            if (response.totalDeals !== undefined) message += `\n📊 **Total Deals:** ${response.totalDeals}`;
            this.addBotResponse(message, true); 
        },
        error: (err: HttpErrorResponse) => this.handleApiError(err, 'testing database connection (legacy)')
    });
  }


  private handleLegacyResponse(response: QueryResponse, queryName: string) {
    this.isTyping = false;
    this.showResultsSkeleton = false;
    if (response.error) {
      this.addBotResponse(`⚠️ Error fetching ${queryName}: ${response.error}`, false);
      this.results = [];
    } else if (response.result && response.result.length > 0) {
      const formatted = this.formatGeneralResults(response.result, response.sql || `Legacy ${queryName}`, response.count || response.result.length);
      this.addBotResponse(formatted, true);
      this.results = response.result;
    } else if (response.deals && response.deals.length > 0) { 
      const formatted = this.formatDeals(response.deals); 
      this.addBotResponse(formatted, true);
      this.results = response.deals;
    }
     else {
      this.addBotResponse(`📊 No results found for ${queryName} (legacy). SQL: \`${response.sql || 'N/A'}\``, false);
      this.results = [];
    }
  }
  private getSuggestions(input: string): string[] {
    const lowerInput = input.toLowerCase();
    const suggestions = new Set<string>(); 

    this.queryHistory
      .filter(query => query.toLowerCase().includes(lowerInput))
      .slice(0, 2)
      .forEach(s => suggestions.add(s));
    this.smartSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(lowerInput))
      .slice(0, 3)
      .forEach(s => suggestions.add(s));

    return Array.from(suggestions).slice(0, 5); 
  }

  private addToHistory(query: string) {
    if (!this.queryHistory.includes(query)) {
      this.queryHistory.unshift(query);
      this.queryHistory = this.queryHistory.slice(0, 20);
      this.saveQueryHistory();
    }
  }

  private saveQueryHistory() {
    try {
      localStorage.setItem('chatbotQueryHistory', JSON.stringify(this.queryHistory));
    } catch (e) {
      console.warn('Could not save query history to localStorage', e);
    }
  }

  private loadQueryHistory() {
    try {
      const historyJson = localStorage.getItem('chatbotQueryHistory');
      if (historyJson) {
        this.queryHistory = JSON.parse(historyJson);
      } else {
        this.queryHistory = [];
      }
    } catch (e) {
      console.warn('Could not load query history from localStorage', e);
      this.queryHistory = [];
    }
  }

  onInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else if (event.key === 'ArrowUp' && this.queryHistory.length > 0 && this.userInput === '') {
        event.preventDefault();
        this.userInput = this.queryHistory[0];
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
    }
  }

  getTimeString(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private formatAiResults(data: any[], sql?: string, count?: number): string {
    let formatted = `📊 **AI Query Results**\n\n`;
    if (count !== undefined) {
      formatted += `🎯 **Records Found:** ${count}\n`;
    } else if (data) {
      formatted += `🎯 **Records Found:** ${data.length}\n`;
    }
    if (sql) {
      formatted += `🔍 **Executed SQL:** \`${sql}\`\n\n`;
    }

    const maxResultsToDisplay = Math.min(5, data?.length || 0);
    if (maxResultsToDisplay === 0 && count === 0) {
    } else if (maxResultsToDisplay === 0 && typeof count === 'number' && count > 0) {
        formatted += `Displaying 0 of ${count} records. (More records available, but not shown in this preview).\n`;
    }


    for (let i = 0; i < maxResultsToDisplay; i++) {
      const row = data[i];
      formatted += `**Record ${i + 1}:**\n`;
      Object.keys(row).forEach(key => {
        let value = row[key];
        if (typeof value === 'string' && (value.includes('T00:00:00') || /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value))) {
          try { value = new Date(value).toLocaleDateString(); } catch (e) {/* ignore */}
        } else if (typeof value === 'number' && (key.toLowerCase().includes('amount') || key.toLowerCase().includes('price'))) {
          value = this.formatCurrency(value);
        } else if (value === null || value === undefined) {
            value = 'null';
        }
        formatted += `  • **${key}:** ${value}\n`;
      });
      formatted += '\n';
    }

    if (data && data.length > maxResultsToDisplay) {
      formatted += `📋 *...and ${data.length - maxResultsToDisplay} more record(s) available in export.*`;
    }
    return formatted;
  }
  private formatDeals(deals: any[]): string { 
    let formatted = `📊 **Recent Deal Activity (Legacy)**\n\n🔥 **${deals.length} deals found**\n\n`;
    deals.slice(0, 10).forEach((deal, index) => {
      formatted += `${index + 1}. **${deal.Name || 'Unnamed Deal'}** — ${this.formatCurrency(deal.Amount)}\n`;
    });
    if (deals.length > 10) {
      formatted += `\n📋 *...and ${deals.length - 10} more recent deals*`;
    }
    return formatted;
  }
   private formatGeneralResults(results: any[], sql: string, count: number): string {
    let formatted = `📊 **Query Results (Legacy/General)**\n\n🎯 **Records:** ${count}\n🔍 **SQL:** \`${sql}\`\n\n`;
    const maxResults = Math.min(5, results.length);
    for (let i = 0; i < maxResults; i++) {
      const row = results[i];
      formatted += `**Record ${i + 1}:**\n`;
      Object.keys(row).forEach(key => {
        let value = row[key];
        if (key.toLowerCase().includes('date') && value) value = this.formatDate(value);
        else if (key.toLowerCase().includes('amount') && value) value = this.formatCurrency(value);
        formatted += `  **${key}:** ${value || 'null'}\n`;
      });
      formatted += '\n';
    }
    if (results.length > maxResults) {
      formatted += `📋 *...and ${results.length - maxResults} more records*`;
    }
    return formatted;
  }


  private formatCurrency(amount: any): string {
    if (amount === null || amount === undefined) return 'N/A';
    const num = parseFloat(amount);
    if (isNaN(num)) return String(amount);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  }

  private formatDate(dateStr: any): string {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return String(dateStr); }
  }

  exportResults(format: 'json' | 'csv') {
    if (!this.results || this.results.length === 0) {
      this.addBotResponse('❌ No results to export. Please run a query first.', false);
      return;
    }
    if (format === 'json') this.downloadJSON();
    else if (format === 'csv') this.downloadCSV();
  }

  private downloadJSON() {
    const dataStr = JSON.stringify(this.results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `xlead-ai-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href); 
    this.addBotResponse('📁 **Export Complete:** JSON file downloaded.', true);
  }

  private downloadCSV() {
    if (!this.results.length) return;
    const headers = Object.keys(this.results[0]);
    const csvContent = [
      headers.join(','),
      ...this.results.map(row =>
        headers.map(header => `"${(row[header] === null || row[header] === undefined ? '' : row[header]).toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `xlead-ai-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href); 
    this.addBotResponse('📁 **Export Complete:** CSV file downloaded.', true);
  }
}