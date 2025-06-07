import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  text: string;
  timestamp: Date;
  isUser: boolean;
  queryType?: QueryType;
  hasResults?: boolean;
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
  GENERAL = 'general'
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
export class ChatbotComponent implements AfterViewChecked {
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

  private readonly baseApiUrl = 'https://localhost:7297/api/count';
  connectionStatusText: string = 'Connecting...'; // or appropriate default value


  // Enhanced query patterns for better intelligence
  private queryPatterns: QueryPattern[] = [
    {
      type: QueryType.COUNT,
      patterns: [/count|how many|total|number of/i],
      description: 'Count queries',
      examples: ['count all deals', 'how many closed deals', 'total deals this month']
    },
    {
      type: QueryType.RECENT,
      patterns: [/recent|latest|new|today|yesterday|this week|this month/i],
      description: 'Recent data queries',
      examples: ['recent deals', 'latest opportunities', 'new leads today']
    },
    {
      type: QueryType.FILTER,
      patterns: [/where|with|having|filter|show me.*with|deals.*amount/i],
      description: 'Filtered queries',
      examples: ['deals with amount > 10000', 'show me deals where stage is closed won']
    },
    {
      type: QueryType.SORT,
      patterns: [/top|bottom|highest|lowest|sort|order|best|worst/i],
      description: 'Sorted queries',
      examples: ['top 10 deals', 'highest value opportunities', 'sort by amount']
    },
    {
      type: QueryType.TEST,
      patterns: [/test|connection|database|db|health|ping/i],
      description: 'System testing',
      examples: ['test database', 'check connection', 'system health']
    }
  ];

  messages: ChatMessage[] = [
    {
      text: 'Hello! I\'m your Smart XBot assistant. I can help you with XLead Queries',
      timestamp: new Date(),
      isUser: false
    }
  ];

  // Smart suggestions based on context
  smartSuggestions = [
    'Show me deals created this week',
    'Top 5 deals by amount',
    'Count all opportunities',
    'Deals in negotiation stage',
    'Recent high-value deals',
    'Show me deal pipeline',
    'Average deal amount',
    'Deals by owner'
  ];

  constructor(private http: HttpClient) {
    this.loadQueryHistory();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
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
        text: 'Hello!Ready to help with your XLead data queries. What would you like to know?',
        timestamp: new Date(),
        isUser: false
      }
    ];
    this.results = [];
  }

  // Enhanced input handling with smart suggestions
  onInputChange() {
    if (this.userInput.length > 2) {
      this.suggestions = this.getSuggestions(this.userInput);
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
    if (!this.userInput.trim() || this.isTyping) return;

    const messageText = this.userInput.trim();
    const queryType = this.parseQuery(messageText);
    
    this.messages.push({
      text: messageText,
      timestamp: new Date(),
      isUser: true,
      queryType
    });

    // Add to query history
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

  // Enhanced query parsing with machine learning-like pattern matching
  private parseQuery(input: string): QueryType {
    const lowerInput = input.toLowerCase();
    
    // Score each query type based on pattern matches
    const scores: { [key in QueryType]: number } = {
      [QueryType.COUNT]: 0,
      [QueryType.RECENT]: 0,
      [QueryType.FILTER]: 0,
      [QueryType.SORT]: 0,
      [QueryType.TEST]: 0,
      [QueryType.ALL]: 0,
      [QueryType.GENERAL]: 0
    };

    // Check against defined patterns
    this.queryPatterns.forEach(pattern => {
      pattern.patterns.forEach(regex => {
        if (regex.test(lowerInput)) {
          scores[pattern.type] += 1;
        }
      });
    });

    // Special cases for high-confidence matches
    if (lowerInput.includes('test') && lowerInput.includes('database')) {
      return QueryType.TEST;
    }
    if (lowerInput === 'deals' || lowerInput.includes('all deals')) {
      return QueryType.ALL;
    }

    // Return the highest scoring query type
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return QueryType.GENERAL;

    return Object.keys(scores).find(key => 
      scores[key as QueryType] === maxScore
    ) as QueryType || QueryType.GENERAL;
  }

  private handleUserInput(input: string, queryType: QueryType) {
    const lowerInput = input.toLowerCase();

    switch (queryType) {
      case QueryType.SORT:
        if (lowerInput.includes('top') && (lowerInput.includes('10') || lowerInput.includes('ten'))) {
          this.getTop10Deals();
        } else {
          this.sendGeneralQuery(input);
        }
        break;
      case QueryType.TEST:
        this.testDatabase();
        break;
      case QueryType.RECENT:
        this.getAllDeals();
        break;
      case QueryType.COUNT:
        if (lowerInput.includes('closed won')) {
          this.getClosedWonCount();
        } else {
          this.sendGeneralQuery(input);
        }
        break;
      case QueryType.ALL:
        this.getAllDealsQuery();
        break;
      default:
        this.sendGeneralQuery(input);
    }
  }

  // Enhanced API methods with better error handling and user feedback
  private getAllDealsQuery() {
    this.http.post<QueryResponse>(this.baseApiUrl, { prompt: 'deals' }).subscribe({
      next: (response) => {
        this.showResultsSkeleton = false;
        if (response.result && response.result.length > 0) {
          const formatted = this.formatAllDealsResults(response.result, response.sql || '', response.count || 0);
          this.addBotResponse(formatted, true);
          this.results = response.result;
        } else {
          this.addBotResponse('📊 No deals found in the database. Try checking your database connection or data filters.', false);
        }
        this.isTyping = false;
      },
      error: (error) => {
        this.showResultsSkeleton = false;
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private getTop10Deals() {
    this.http.get<QueryResponse>(`${this.baseApiUrl}/Top10Deals`).subscribe({
      next: (response) => {
        this.showResultsSkeleton = false;
        if (response.deals && response.deals.length > 0) {
          const formatted = this.formatTop10Deals(response.deals, response.count || 0);
          this.addBotResponse(formatted, true);
          this.results = response.deals;
        } else {
          this.addBotResponse('📊 No deals found in the database.', false);
        }
        this.isTyping = false;
      },
      error: (error) => {
        this.showResultsSkeleton = false;
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private testDatabase() {
    this.http.get<any>(`${this.baseApiUrl}/TestDatabase`).subscribe({
      next: (response) => {
        this.showResultsSkeleton = false;
        let message = `✅ **Database Connection Status**\n\n${response.message}\n\n📊 **Total Deals:** ${response.totalDeals}\n\n`;
        
        if (response.columns?.length) {
          message += '📋 **Available Columns:**\n';
          response.columns.forEach((col: any) => {
            message += `• ${col.COLUMN_NAME} (${col.DATA_TYPE})\n`;
          });
        }
        
        if (response.sampleData?.length) {
          message += '\n📝 **Sample Data Preview:**\n';
          response.sampleData.slice(0, 3).forEach((row: any, index: number) => {
            message += `\n**Record ${index + 1}:**\n`;
            Object.keys(row).slice(0, 5).forEach(key => {
              message += `  ${key}: ${row[key]}\n`;
            });
          });
        }
        
        this.addBotResponse(message, true);
        this.isTyping = false;
      },
      error: (error) => {
        this.showResultsSkeleton = false;
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private getAllDeals() {
    this.http.get<any[]>(this.baseApiUrl).subscribe({
      next: (deals) => {
        this.showResultsSkeleton = false;
        if (deals && deals.length > 0) {
          const formatted = this.formatDeals(deals);
          this.addBotResponse(formatted, true);
          this.results = deals;
        } else {
          this.addBotResponse('📊 No recent deals found.', false);
        }
        this.isTyping = false;
      },
      error: (error) => {
        this.showResultsSkeleton = false;
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private getClosedWonCount() {
    this.http.get<{ closedWonCount: number }>(`${this.baseApiUrl}/ClosedWonCount`).subscribe({
      next: (response) => {
        this.showResultsSkeleton = false;
        const message = `🎯 **Closed Won Deals Count**\n\n**Total:** ${response.closedWonCount} deals\n\n💡 *Great job on closing those deals!*`;
        this.addBotResponse(message, true);
        this.isTyping = false;
      },
      error: (error) => {
        this.showResultsSkeleton = false;
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private sendGeneralQuery(prompt: string) {
    this.http.post<QueryResponse>(this.baseApiUrl, { prompt }).subscribe({
      next: (response) => {
        this.showResultsSkeleton = false;
        let botText = '';
        if (response.result?.length) {
          botText = this.formatGeneralResults(response.result, response.sql || '', response.count || 0);
          this.addBotResponse(botText, true);
        } else {
          botText = `🔍 **Query Executed**\n\nSQL: \`${response.sql || 'Unknown'}\`\n\n📊 No results found for your query. Try refining your search terms.`;
          this.addBotResponse(botText, false);
        }
        this.results = response.result || [];
        this.isTyping = false;
      },
      error: (error) => {
        this.showResultsSkeleton = false;
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private addBotResponse(text: string, hasResults: boolean = false) {
    this.messages.push({
      text,
      timestamp: new Date(),
      isUser: false,
      hasResults
    });
  }

  private handleError(error: any) {
    let errorMessage = '❌ **Oops! Something went wrong**\n\n';
    
    if (error.status === 0) {
      errorMessage += '🔌 **Connection Issue**\nCannot connect to server. Please check if the backend is running on https://localhost:7297\n\n💡 *Try refreshing the page or contact your system administrator.*';
    } else if (error.status === 404) {
      errorMessage += '🔍 **Endpoint Not Found**\nAPI endpoint not found. Please check the server configuration.\n\n💡 *The requested resource might have been moved or deleted.*';
    } else if (error.status === 500) {
      errorMessage += '⚠️ **Server Error**\nServer error. Please check your database connection and table structure.\n\n💡 *This is typically a backend issue. Try again in a moment.*';
    } else if (error.error?.details) {
      errorMessage += `🔧 **Error Details**\n${error.error.details}\n\n💡 *Check the error details above for more information.*`;
    } else {
      errorMessage += '❓ **Unknown Error**\nSorry, I couldn\'t process your request.\n\n💡 *Try rephrasing your query or use one of the quick actions.*';
    }
    
    this.addBotResponse(errorMessage, false);
  }

  // Smart suggestion system
  private getSuggestions(input: string): string[] {
    const suggestions = [];
    
    // Add query history matches
    const historyMatches = this.queryHistory.filter(query => 
      query.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 3);
    
    // Add smart suggestions matches
    const smartMatches = this.smartSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 3);
    
    suggestions.push(...historyMatches, ...smartMatches);
    
    // Remove duplicates and limit to 5
    return [...new Set(suggestions)].slice(0, 5);
  }

  private addToHistory(query: string) {
    if (!this.queryHistory.includes(query)) {
      this.queryHistory.unshift(query);
      this.queryHistory = this.queryHistory.slice(0, 20); // Keep last 20 queries
      this.saveQueryHistory();
    }
  }

  private saveQueryHistory() {
    try {
      // In a real app, you'd save to a backend service
      // For now, we'll just keep it in memory
    } catch (error) {
      console.warn('Could not save query history:', error);
    }
  }

  private loadQueryHistory() {
    try {
      // In a real app, you'd load from a backend service
      // For now, initialize with empty array
      this.queryHistory = [];
    } catch (error) {
      console.warn('Could not load query history:', error);
      this.queryHistory = [];
    }
  }

  onInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
    }
  }

  getTimeString(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = minutes < 10 ? '0' + minutes : minutes;
    return `${h}:${m} ${ampm}`;
  }

  // Enhanced formatting methods with better visual appeal
  private formatAllDealsResults(deals: any[], sql: string, count: number): string {
    let formatted = `📊 **All Deals Overview**\n\n🎯 **Found:** ${count} records\n🔍 **SQL:** \`${sql}\`\n\n`;
    
    const maxResults = Math.min(10, deals.length);
    for (let i = 0; i < maxResults; i++) {
      const deal = deals[i];
      formatted += `**${i + 1}. ${deal.Name || 'Unnamed Deal'}**\n`;
      formatted += `💰 Amount: ${this.formatCurrency(deal.Amount)}\n`;
      formatted += `📈 Stage: ${deal.Stage || 'Unknown'}\n`;
      formatted += `📅 Created: ${this.formatDate(deal.CreatedDate)}\n`;
      if (deal.OwnerId) formatted += `👤 Owner: ${deal.OwnerId}\n`;
      formatted += '\n';
    }
    
    if (deals.length > maxResults) {
      formatted += `📋 *...and ${deals.length - maxResults} more deals available*`;
    }
    
    return formatted;
  }

  private formatTop10Deals(deals: any[], count: number): string {
    let formatted = `🎯 **Top 10 Highest Value Deals**\n\n📊 Total deals analyzed: ${count}\n\n`;
    
    deals.forEach((deal, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
      formatted += `${medal} **${index + 1}. ${deal.Name || 'Unnamed Deal'}**\n`;
      formatted += `💰 Amount: ${this.formatCurrency(deal.Amount)}\n`;
      formatted += `📈 Stage: ${deal.Stage || 'Unknown'}\n`;
      formatted += `📅 Created: ${this.formatDate(deal.CreatedDate)}\n`;
      if (deal.OwnerId) formatted += `👤 Owner: ${deal.OwnerId}\n`;
      formatted += '\n';
    });
    
    return formatted;
  }

  private formatDeals(deals: any[]): string {
    let formatted = `📊 **Recent Deal Activity**\n\n🔥 **${deals.length} deals found**\n\n`;
    
    deals.slice(0, 10).forEach((deal, index) => {
      formatted += `${index + 1}. **${deal.Name || 'Unnamed Deal'}** — ${this.formatCurrency(deal.Amount)}\n`;
    });
    
    if (deals.length > 10) {
      formatted += `\n📋 *...and ${deals.length - 10} more recent deals*`;
    }
    
    return formatted;
  }

  private formatGeneralResults(results: any[], sql: string, count: number): string {
    let formatted = `📊 **Query Results**\n\n🎯 **Records:** ${count}\n🔍 **SQL:** \`${sql}\`\n\n`;
    
    const maxResults = Math.min(5, results.length);
    for (let i = 0; i < maxResults; i++) {
      const row = results[i];
      formatted += `**Record ${i + 1}:**\n`;
      Object.keys(row).forEach(key => {
        let value = row[key];
        if (key.toLowerCase().includes('date') && value) {
          value = this.formatDate(value);
        } else if (key.toLowerCase().includes('amount') && value) {
          value = this.formatCurrency(value);
        }
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }

  private formatDate(dateStr: any): string {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return String(dateStr);
    }
  }

  // Export functionality
  exportResults(format: 'json' | 'csv') {
    if (!this.results.length) {
      this.addBotResponse('❌ No results to export. Please run a query first.', false);
      return;
    }

    if (format === 'json') {
      this.downloadJSON();
    } else if (format === 'csv') {
      this.downloadCSV();
    }
  }

  private downloadJSON() {
    const dataStr = JSON.stringify(this.results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `xlead-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    this.addBotResponse('📁 **Export Complete**\n\nJSON file has been downloaded successfully!', true);
  }

  private downloadCSV() {
    if (!this.results.length) return;
    
    const headers = Object.keys(this.results[0]);
    const csvContent = [
      headers.join(','),
      ...this.results.map(row => 
        headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `xlead-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    this.addBotResponse('📁 **Export Complete**\n\nCSV file has been downloaded successfully!', true);
 
  }
  
}