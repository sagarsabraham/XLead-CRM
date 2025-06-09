// chatbot.component.ts

import { Component, AfterViewChecked, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core'; // Added OnInit, OnDestroy
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Added HttpErrorResponse
// import { Subscription } from 'rxjs'; // If you decide to manage subscriptions explicitly

// --- 1. Define the New API Response Interface/Class ---
interface AiQueryServerResponse {
  message: string;        // Informational message from backend
  results?: any[];        // The actual data rows (array of objects)
  generatedSql?: string;  // The SQL query generated and executed
  count?: number;         // Count of results
  success: boolean;       // Indicates overall success from backend logic
}

// Keep existing interfaces
interface ChatMessage {
  text: string;
  timestamp: Date;
  isUser: boolean;
  queryType?: QueryType;
  hasResults?: boolean;
  sqlQuery?: string; // Optional: to display the SQL for AI queries
}

interface QueryResponse { // This was for your older endpoints
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
  ALL = 'all', // For "show all deals" type specific queries
  TEST = 'test',
  GENERAL = 'general', // This will now be our primary AI-driven query type
  AI_QUERY = 'ai_query' // Explicit type if you want to differentiate more
}

// QueryPattern interface (keep as is or adapt if needed)
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
export class ChatbotComponent implements AfterViewChecked, OnInit { // Added OnInit
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  isCollapsed = true;
  userInput: string = '';
  isTyping: boolean = false;
  results: any[] = []; // Used for export functionality
  showSuggestions = false;
  suggestions: string[] = [];
  queryHistory: string[] = [];
  showResultsSkeleton = false;

  // --- 2. Update API URL Constants ---
  private readonly legacyBaseApiUrl = 'https://localhost:7297/api/count'; // Your existing .NET API port for old endpoints
  private readonly aiQueryApiUrl = 'https://localhost:7297/api/aiquery/process-natural-language'; // NEW AI Endpoint

  // connectionStatusText: string = 'Connecting...'; // Not used in provided snippet, remove if not needed

  // queryPatterns (Keep or adapt; GENERAL type is key now)
  private queryPatterns: QueryPattern[] = [
    {
      type: QueryType.COUNT,
      patterns: [/count|how many|total|number of/i],
      description: 'Count queries',
      examples: ['count all deals', 'how many closed deals', 'total deals this month']
    },
    {
      type: QueryType.RECENT, // You might keep this for a specific "recent deals" endpoint
      patterns: [/recent deals|latest deals|new deals/i], // More specific to avoid AI for this
      description: 'Recent data queries',
      examples: ['recent deals']
    },
    // Filter and Sort might now be handled by AI (GENERAL)
    // {
    //   type: QueryType.FILTER,
    //   patterns: [/where|with|having|filter|show me.*with|deals.*amount/i],
    //   description: 'Filtered queries',
    //   examples: ['deals with amount > 10000', 'show me deals where stage is closed won']
    // },
    // {
    //   type: QueryType.SORT,
    //   patterns: [/top|bottom|highest|lowest|sort|order|best|worst/i],
    //   description: 'Sorted queries',
    //   examples: ['top 10 deals', 'highest value opportunities', 'sort by amount']
    // },
    {
      type: QueryType.TEST,
      patterns: [/test connect|test database|db health|ping db/i], // Made more specific
      description: 'System testing',
      examples: ['test database connection', 'check db health']
    },
    { // Example specific query that might hit an old endpoint or a specific AI instruction
      type: QueryType.ALL,
      patterns: [/^show all deals$/i, /^list all deals$/i, /^all deals$/i],
      description: 'Show all deals',
      examples: ['show all deals']
    }
    // GENERAL will be the fallback for AI
  ];


  messages: ChatMessage[] = []; // Initialize empty, will be populated by ngOnInit

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
    // this.loadQueryHistory(); // Moved to ngOnInit
  }

  ngOnInit() {
    this.loadQueryHistory();
    // Initial welcome message
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
      // console.error('Error scrolling to bottom:', err);
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
    this.results = []; // Clear exportable results
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
    this.showResultsSkeleton = true; // Show skeleton immediately

    this.handleUserInput(messageText, queryType);
  }

  // sendQuickAction can remain similar, just ensure it uses the new parsing logic
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
    // If no specific pattern matches, assume it's a general query for the AI
    return QueryType.GENERAL;
  }

  private handleUserInput(input: string, queryType: QueryType) {
    const lowerInput = input.toLowerCase();

    // Log the determined query type
    console.log(`Handling input: "${input}", QueryType: ${queryType}`);

    switch (queryType) {
      case QueryType.TEST:
        this.testDatabaseConnection(); // Assuming this hits a specific endpoint
        break;
      case QueryType.ALL: // Example: "show all deals"
        this.getLegacyAllDeals(); // Or make it AI driven
        break;
      case QueryType.RECENT: // Example "recent deals"
        this.getLegacyRecentDeals();
        break;
      case QueryType.COUNT: // Specific count like "count closed won deals"
        if (lowerInput.includes('closed won')) {
            this.getLegacyClosedWonCount();
        } else {
            // Let AI handle other counts
            this.processWithAi(input);
        }
        break;
      case QueryType.GENERAL:
      case QueryType.AI_QUERY: // If you add this type
      case QueryType.FILTER:   // Let AI handle these
      case QueryType.SORT:     // Let AI handle these
      default:
        this.processWithAi(input);
        break;
    }
  }

  // --- 3. Modify processWithAi (formerly sendGeneralQuery) ---
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
            this.results = response.results; // For export
          } else if (response.success && (!response.results || response.results.length === 0)) {
            botText = `✅ ${response.message || 'Query executed successfully, but no matching records were found.'}`;
            if (response.generatedSql) {
              botText += `\n\n🔍 SQL: \`${response.generatedSql}\``;
            }
            this.addBotResponse(botText, false, response.generatedSql);
            this.results = [];
          }
          else { // Handles response.success === false or other non-data yielding success cases
            botText = `⚠️ ${response.message || 'I could not retrieve the data for your query.'}`;
             if (response.generatedSql) { // Even on failure, backend might send the (failed) SQL
              botText += `\n\nAttempted SQL: \`${response.generatedSql}\``;
            }
            this.addBotResponse(botText, false, response.generatedSql);
            this.results = [];
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isTyping = false;
          this.showResultsSkeleton = false;
          this.handleApiError(err, prompt); // Use the refined error handler
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
      sqlQuery // Store the SQL if available
    });
  }

  // --- 5. Update handleError (or create a new one for API errors) ---
  private handleApiError(error: HttpErrorResponse, queryContext?: string) {
    let errorMessage = `❌ Oops! I encountered a problem processing your request${queryContext ? ' for: "' + queryContext + '"' : ''}.\n\n`;

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage += `Network/Client Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage += `Server Error (Status: ${error.status}):\n`;
      if (error.error && typeof error.error.message === 'string') {
        errorMessage += error.error.message; // Message from backend's AiQueryResponseDto (e.g., on 500 with custom msg)
      } else if (typeof error.error === 'string' && error.error.length < 200) { // Check if error.error is a simple string
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


  // --- Keep/Adapt Legacy Methods if still needed for specific non-AI queries ---
  // These would hit your older '/api/count/*' endpoints

  private getLegacyAllDeals() {
    this.http.post<QueryResponse>(`${this.legacyBaseApiUrl}`, { prompt: 'deals' }).subscribe({
      next: (response) => this.handleLegacyResponse(response, 'All Deals'),
      error: (err: HttpErrorResponse) => this.handleApiError(err, 'fetching all deals (legacy)')
    });
  }

  private getLegacyRecentDeals() {
    // Assuming you have an endpoint for this at legacyBaseApiUrl or a sub-path
    this.http.get<any[]>(`${this.legacyBaseApiUrl}/RecentDeals`).subscribe({ // Adjust endpoint
        next: (deals) => {
            this.isTyping = false;
            this.showResultsSkeleton = false;
            if (deals && deals.length > 0) {
                const formatted = this.formatDeals(deals); // Your existing formatDeals
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
        this.results = [{ 'Closed Won Count': response.closedWonCount }]; // For export
      },
      error: (err: HttpErrorResponse) => this.handleApiError(err, 'fetching closed won count (legacy)')
    });
  }

  private testDatabaseConnection() {
    // This should hit your /TestDatabase endpoint, which might be on legacyBaseApiUrl or a new one
    this.http.get<any>(`${this.legacyBaseApiUrl}/TestDatabase`).subscribe({ // Adjust endpoint if needed
        next: (response) => {
            this.isTyping = false;
            this.showResultsSkeleton = false;
            let message = `✅ **Database Connection Test (Legacy)**\n\n${response.message}\n`;
            if (response.totalDeals !== undefined) message += `\n📊 **Total Deals:** ${response.totalDeals}`;
            // ... (add more details from response if available)
            this.addBotResponse(message, true); // Assuming test provides some "result"
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
    } else if (response.deals && response.deals.length > 0) { // For specific deal structures
      const formatted = this.formatDeals(response.deals); // Assuming you have formatDeals
      this.addBotResponse(formatted, true);
      this.results = response.deals;
    }
     else {
      this.addBotResponse(`📊 No results found for ${queryName} (legacy). SQL: \`${response.sql || 'N/A'}\``, false);
      this.results = [];
    }
  }

  // --- Suggestion System (Keep as is) ---
  private getSuggestions(input: string): string[] {
    const lowerInput = input.toLowerCase();
    const suggestions = new Set<string>(); // Use Set to avoid duplicates easily

    // History matches
    this.queryHistory
      .filter(query => query.toLowerCase().includes(lowerInput))
      .slice(0, 2) // Limit history suggestions
      .forEach(s => suggestions.add(s));

    // Smart suggestions matches
    this.smartSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(lowerInput))
      .slice(0, 3) // Limit smart suggestions
      .forEach(s => suggestions.add(s));

    return Array.from(suggestions).slice(0, 5); // Return unique, limited suggestions
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
        this.userInput = this.queryHistory[0]; // Load last query
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
    }
  }

  getTimeString(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // --- 6. Review formatAiResults (adapt formatGeneralResults) ---
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
        // This case is typically handled by the response.message from backend
        // formatted += "No matching records were found.\n";
    } else if (maxResultsToDisplay === 0 && typeof count === 'number' && count > 0) {
        formatted += `Displaying 0 of ${count} records. (More records available, but not shown in this preview).\n`;
    }


    for (let i = 0; i < maxResultsToDisplay; i++) {
      const row = data[i];
      formatted += `**Record ${i + 1}:**\n`;
      Object.keys(row).forEach(key => {
        let value = row[key];
        // Basic type formatting (can be expanded)
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

  // Keep your existing formatting helpers or adapt them
  private formatDeals(deals: any[]): string { // For legacy if needed
    let formatted = `📊 **Recent Deal Activity (Legacy)**\n\n🔥 **${deals.length} deals found**\n\n`;
    deals.slice(0, 10).forEach((deal, index) => {
      formatted += `${index + 1}. **${deal.Name || 'Unnamed Deal'}** — ${this.formatCurrency(deal.Amount)}\n`;
    });
    if (deals.length > 10) {
      formatted += `\n📋 *...and ${deals.length - 10} more recent deals*`;
    }
    return formatted;
  }

  // General results formatter (can be used by legacy or as a fallback)
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

  // Export functionality (Keep as is, it uses this.results)
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
    URL.revokeObjectURL(link.href); // Clean up
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
    URL.revokeObjectURL(link.href); // Clean up
    this.addBotResponse('📁 **Export Complete:** CSV file downloaded.', true);
  }
}