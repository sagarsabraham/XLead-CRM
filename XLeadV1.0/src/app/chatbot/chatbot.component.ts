import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  text: string;
  timestamp: Date;
  isUser: boolean;
}

interface QueryResponse {
  sql: string;
  result?: any[];
  deals?: any[];
  count?: number;
  message?: string;
  error?: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  isCollapsed = true;
  userInput: string = '';
  isTyping: boolean = false;
  results: any[] = [];

  private readonly baseApiUrl = 'https://localhost:7297/api/count';

  messages: ChatMessage[] = [
    {
      text: 'Hello! I can help you with XLead data. Try asking:\n• "deals" - Get all deals\n• "top 10 deals"\n• "recent deals"\n• "count all deals"\n• "test database"',
      timestamp: new Date(),
      isUser: false
    }
  ];

  constructor(private http: HttpClient) {}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  clearChat() {
    this.messages = [
      {
        text: 'Hello! I can help you with XLead data. Try asking:\n• "deals" - Get all deals\n• "top 10 deals"\n• "recent deals"\n• "count all deals"\n• "test database"',
        timestamp: new Date(),
        isUser: false
      }
    ];
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isTyping) return;

    const messageText = this.userInput.trim();
    this.messages.push({
      text: messageText,
      timestamp: new Date(),
      isUser: true
    });

    this.userInput = '';
    this.isTyping = true;

    this.handleUserInput(messageText);
  }

  private handleUserInput(input: string) {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('top 10 deals') || lowerInput.includes('top ten deals')) {
      this.getTop10Deals();
    } else if (lowerInput.includes('test database')) {
      this.testDatabase();
    } else if (lowerInput.includes('recent deals')) {
      this.getAllDeals();
    } else if (lowerInput.includes('closed won')) {
      this.getClosedWonCount();
    } else if (lowerInput === 'deals' || lowerInput.includes('all deals') || lowerInput.includes('show deals')) {
      // Handle simple "deals" query
      this.getAllDealsQuery();
    } else {
      this.sendGeneralQuery(input);
    }
  }

  private getAllDealsQuery() {
    this.http.post<QueryResponse>(this.baseApiUrl, { prompt: 'deals' }).subscribe({
      next: (response) => {
        if (response.result && response.result.length > 0) {
          const formatted = this.formatAllDealsResults(response.result, response.sql || '', response.count || 0);
          this.addBotResponse(formatted);
          this.results = response.result;
        } else {
          this.addBotResponse('📊 No deals found in the database.');
        }
        this.isTyping = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private getTop10Deals() {
    this.http.get<QueryResponse>(`${this.baseApiUrl}/Top10Deals`).subscribe({
      next: (response) => {
        if (response.deals && response.deals.length > 0) {
          const formatted = this.formatTop10Deals(response.deals, response.count || 0);
          this.addBotResponse(formatted);
          this.results = response.deals;
        } else {
          this.addBotResponse('📊 No deals found in the database.');
        }
        this.isTyping = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private testDatabase() {
    this.http.get<any>(`${this.baseApiUrl}/TestDatabase`).subscribe({
      next: (response) => {
        let message = `✅ ${response.message}\n\n📊 Total Deals: ${response.totalDeals}\n\n`;
        if (response.columns?.length) {
          message += '📋 Available Columns:\n';
          response.columns.forEach((col: any) => {
            message += `• ${col.COLUMN_NAME} (${col.DATA_TYPE})\n`;
          });
        }
        if (response.sampleData?.length) {
          message += '\n📝 Sample Data:\n';
          response.sampleData.forEach((row: any, index: number) => {
            message += `\nRecord ${index + 1}:\n`;
            Object.keys(row).forEach(key => {
              message += `  ${key}: ${row[key]}\n`;
            });
          });
        }
        this.addBotResponse(message);
        this.isTyping = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private getAllDeals() {
    this.http.get<any[]>(this.baseApiUrl).subscribe({
      next: (deals) => {
        if (deals && deals.length > 0) {
          const formatted = this.formatDeals(deals);
          this.addBotResponse(formatted);
          this.results = deals;
        } else {
          this.addBotResponse('📊 No deals found.');
        }
        this.isTyping = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private getClosedWonCount() {
    this.http.get<{ closedWonCount: number }>(`${this.baseApiUrl}/ClosedWonCount`).subscribe({
      next: (response) => {
        const message = `🎯 Closed Won Deal Count: ${response.closedWonCount}`;
        this.addBotResponse(message);
        this.isTyping = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private sendGeneralQuery(prompt: string) {
    this.http.post<QueryResponse>(this.baseApiUrl, { prompt }).subscribe({
      next: (response) => {
        let botText = '';
        if (response.result?.length) {
          botText = this.formatGeneralResults(response.result, response.sql || '', response.count || 0);
        } else {
          botText = `Query executed: ${response.sql || 'Unknown'}\n\n📊 No results found.`;
        }
        this.addBotResponse(botText);
        this.results = response.result || [];
        this.isTyping = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isTyping = false;
      }
    });
  }

  private addBotResponse(text: string) {
    this.messages.push({
      text,
      timestamp: new Date(),
      isUser: false
    });
  }

  private handleError(error: any) {
    let errorMessage = '❌ Sorry, I couldn\'t process your request.';
    if (error.status === 0) {
      errorMessage = '❌ Cannot connect to server. Please check if the backend is running on https://localhost:7297';
    } else if (error.status === 404) {
      errorMessage = '❌ API endpoint not found. Please check the server configuration.';
    } else if (error.status === 500) {
      errorMessage = '❌ Server error. Please check your database connection and table structure.';
    } else if (error.error?.details) {
      errorMessage = `❌ Error: ${error.error.details}`;
    }
    this.addBotResponse(errorMessage);
  }

  onInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
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

  private formatAllDealsResults(deals: any[], sql: string, count: number): string {
    let formatted = `📊 **All Deals** (${count} records found)\n\n🔍 SQL: ${sql}\n\n`;
    
    const maxResults = Math.min(10, deals.length);
    for (let i = 0; i < maxResults; i++) {
      const deal = deals[i];
      formatted += `**${i + 1}. ${deal.Name || 'Unnamed Deal'}**\n`;
      formatted += `💰 Amount: ${this.formatCurrency(deal.Amount)}\n`;
      formatted += `📈 Stage: ${deal.Stage || 'Unknown'}\n`;
      formatted += `📅 Created: ${this.formatDate(deal.CreatedDate)}\n`;
      if (deal.OwnerId) formatted += `👤 Owner ID: ${deal.OwnerId}\n`;
      formatted += '\n';
    }
    
    if (deals.length > maxResults) {
      formatted += `... and ${deals.length - maxResults} more deals.`;
    }
    
    return formatted;
  }

  private formatTop10Deals(deals: any[], count: number): string {
    let formatted = `🎯 **Top 10 Deals** (${count} deals found)\n\n`;
    deals.forEach((deal, index) => {
      formatted += `**${index + 1}. ${deal.Name || 'Unnamed Deal'}**\n`;
      formatted += `💰 Amount: ${this.formatCurrency(deal.Amount)}\n`;
      formatted += `📈 Stage: ${deal.Stage || 'Unknown'}\n`;
      formatted += `📅 Created: ${this.formatDate(deal.CreatedDate)}\n`;
      if (deal.OwnerId) formatted += `👤 Owner ID: ${deal.OwnerId}\n`;
      formatted += '\n';
    });
    return formatted;
  }

  private formatDeals(deals: any[]): string {
    let formatted = `📊 **Recent Deals** (${deals.length} deals)\n\n`;
    deals.slice(0, 10).forEach((deal, index) => {
      formatted += `${index + 1}. ${deal.Name || 'Unnamed Deal'} — ${this.formatCurrency(deal.Amount)}\n`;
    });
    if (deals.length > 10) {
      formatted += `\n...and ${deals.length - 10} more deals.`;
    }
    return formatted;
  }

  private formatGeneralResults(results: any[], sql: string, count: number): string {
    let formatted = `📊 **Query Results** (${count} records)\n\n🔍 SQL: ${sql}\n\n`;
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
        formatted += `  ${key}: ${value || 'null'}\n`;
      });
      formatted += '\n';
    }
    if (results.length > maxResults) {
      formatted += `... and ${results.length - maxResults} more records.`;
    }
    return formatted;
  }

  private formatCurrency(amount: any): string {
    if (amount === null || amount === undefined) return 'N/A';
    const num = parseFloat(amount);
    if (isNaN(num)) return String(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
}