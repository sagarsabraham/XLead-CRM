import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { GridColumn, ExportFormat } from './table.interface';
 
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements AfterViewInit {
  @Input() data: any[] = [];
  @Input() headers: GridColumn[] = [];
  @Input() classNames: string = '';
  @Input() useOwnerTemplate: boolean = true;
  @Input() ownerField: string = 'owner';
  @Input() exportFileName: string = 'Data';
  @Input() entityType: string = 'Item';
  @Output() onSelectionChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowUpdating: EventEmitter<any> = new EventEmitter<any>();
 
  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
 
  pageSize: number = 10;
  allowedPageSizes: number[] = [5, 10, 20];
  selectedRowKeys: string[] = [];
  showExportModal: boolean = false;
  showExportMessage: boolean = false;
  exportMessage: string = '';
  showCustomColumnChooser: boolean = false;
  showFilterRow: boolean = true;
  showHeaderFilter: boolean = true;
  showFilterPanel: boolean = true;
  showSearchPanel: boolean = true;
  columnVisibility: { [key: string]: boolean } = {};
  exportColumnVisibility: { [key: string]: boolean } = {};
 
  private readonly ownerColors: readonly string[] = [
    '#2196f3', '#4caf50', '#9c27b0', '#1976d2',
    '#d32f2f', '#ff9800', '#673ab7', '#009688',
  ];
 
  isMobile: boolean = false;
  showSortOptions: boolean = false;
  showColumnChooserMobile: boolean = false;
  showMobileExportOptions: boolean = false;
  showMobileFilterOptions: boolean = false;
  selectedContact: any = null;
  isDetailsModalOpen: boolean = false;
  sortField: string = '';
  sortDirection: string = '';
  searchQuery: string = '';
  filterValues: { [key: string]: string } = {};
  currentPage: number = 1;
  mobilePageSize: number = 10;
  mobileAllowedPageSizes: number[] = [5, 10, 20];
  paginatedData: any[] = [];
  cardFields: string[] = [];
  filterBuilderValue: any[] = [];
 
  constructor(private cdr: ChangeDetectorRef) {
    this.initializeHeaders();
  }
 
  get modalHeading(): string {
    return `${this.entityType} Details`;
  }
 
  get searchPlaceholder(): string {
    return `Search ${this.entityType.toLowerCase()}s...`;
  }
 
  private adjustFilterRowPosition(): void {
    if (!this.dataGrid?.instance) return;
    setTimeout(() => {
      const headerElement = document.querySelector('.dx-datagrid-headers') as HTMLElement;
      if (headerElement) {
        const headerHeight = headerElement.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      }
    }, 100);
  }
 
  ngOnInit() {
    console.log('=== NG ON INIT ===');
    console.log('Input data length:', this.data.length);
    console.log('Input headers:', this.headers);
    console.log('Sample data:', this.data.slice(0, 2));
    console.log('Entity type:', this.entityType);
    console.log('Export filename:', this.exportFileName);
    console.log('==================');
    this.normalizeData();
    this.checkIfMobile();
    this.data = this.data.map((item, index) => ({
      ...item,
      id: item.id ?? `row-${index + 1}`,
    }));
    this.filterBuilderValue = [];
    this.initializeColumnVisibility();
    this.selectedRowKeys = [];
    this.updateMobileData();
  }
 
  ngAfterViewInit(): void {
    if (!this.isMobile && this.dataGrid?.instance) {
      this.configureDataGrid();
      this.adjustFilterRowPosition();
    }
    console.log('=== TABLE COMPONENT AFTER VIEW INIT ===');
    console.log('Data sample:', this.data.slice(0, 2));
    console.log('Export filename:', this.exportFileName);
    console.log('Data IDs:', this.data.slice(0, 5).map(item => ({ id: item.id, type: typeof item.id })));
    console.log('Card fields:', this.cardFields);
    console.log('Column visibility:', this.columnVisibility);
    console.log('Export column visibility:', this.exportColumnVisibility);
    console.log('=====================================');
  }
 
  @HostListener('window:resize')
  onWindowResize(): void {
    console.log('=== WINDOW RESIZE EVENT ===');
    console.log('Window innerWidth:', window.innerWidth);
    this.checkIfMobile();
    this.cdr.detectChanges();
  }
 
  private normalizeData(): void {
    this.data = this.data.map(item => {
      const normalizedItem = { ...item };
      this.headers.forEach(header => {
        const field = header.dataField;
        const value = normalizedItem[field];
        if (value != null) {
          if (header.dataType === 'date') {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              // Strip time component for date fields
              normalizedItem[field] = new Date(date.getFullYear(), date.getMonth(), date.getDate());
              console.log(`Normalized ${field}:`, normalizedItem[field]);
            } else {
              console.warn(`Invalid date for ${field}: ${value}`);
              normalizedItem[field] = null;
            }
          } else if (header.dataType === 'number') {
            normalizedItem[field] = Number(value);
            if (isNaN(normalizedItem[field])) {
              console.warn(`Invalid number for ${field}: ${value}`);
              normalizedItem[field] = null;
            }
          } else if (header.dataType === 'boolean') {
            normalizedItem[field] = value === 'true' || value === true || value === 1;
          }
        }
      });
      return normalizedItem;
    });
  }
 
  getDisplayValue(item: any, field: string): string {
    if (item[field] == null) {
      return `No ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    }
    const header = this.headers.find(h => h.dataField === field);
    if (header?.dataType === 'date' && item[field] instanceof Date) {
      if (header.format && typeof header.format === 'string') {
        const date = item[field];
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return header.format
          .replace('dd', day)
          .replace('MMM', month)
          .replace('yyyy', String(year));
      }
      return item[field].toLocaleDateString('en-US');
    }
    if (header?.format && typeof header.format === 'object' && header.format.type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: header.format.currency || 'USD',
        minimumFractionDigits: header.format.precision || 2
      }).format(item[field]);
    }
    return String(item[field]);
  }
 
  private checkIfMobile(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 576;
    console.log('=== CHECK IF MOBILE ===');
    console.log('wasMobile:', wasMobile);
    console.log('isMobile:', this.isMobile);
    console.log('window.innerWidth:', window.innerWidth);
    if (wasMobile !== this.isMobile) {
      this.selectedRowKeys = [];
      this.filterValues = {};
      this.filterBuilderValue = [];
      this.searchQuery = '';
      this.sortField = '';
      this.sortDirection = '';
      this.currentPage = 1;
      this.emitSelectionChange();
      this.updateMobileData();
    }
    console.log('=====================');
  }
 
  private updateMobileData(): void {
    console.log('=== UPDATE MOBILE DATA ===');
    console.log('Input data length:', this.data.length);
    console.log('Headers length:', this.headers.length);
    console.log('Headers:', this.headers);
    console.log('Current page:', this.currentPage);
    console.log('Mobile page size:', this.mobilePageSize);
    console.log('Filter builder value:', this.filterBuilderValue);
    console.log('Search query:', this.searchQuery);
    console.log('Sort field:', this.sortField, 'Direction:', this.sortDirection);
    console.log('Column visibility:', this.columnVisibility);
    console.log('Export column visibility:', this.exportColumnVisibility);
    console.log('Card fields:', this.cardFields);
 
    if (!this.data || this.data.length === 0) {
      console.log('No input data available');
      this.paginatedData = [];
      this.cdr.detectChanges();
      return;
    }
 
    if (!this.headers || this.headers.length === 0) {
      console.log('No headers provided, using raw data');
      this.paginatedData = this.data.slice(0, this.mobilePageSize);
      this.cardFields = Object.keys(this.data[0] || {}).slice(0, 3);
      this.cdr.detectChanges();
      return;
    }
 
    if (!this.cardFields.length) {
      console.log('Initializing card fields with visible headers');
      this.cardFields = this.headers
        .filter(header => header.visible !== false)
        .slice(0, 3)
        .map(header => header.dataField);
    }
 
    let filteredData = [...this.data];
 
    if (this.filterBuilderValue && this.filterBuilderValue.length > 0) {
      console.log('Applying filter builder filters');
      filteredData = this.applyDevExtremeFilter(filteredData, this.filterBuilderValue);
    } else {
      console.log('No filter builder filters applied');
    }
 
    if (this.searchQuery) {
      console.log('Applying search query:', this.searchQuery);
      filteredData = filteredData.filter(item => {
        return this.headers.some(header => {
          const field = header.dataField;
          const value = item[field];
          return value != null && String(value).toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      });
    } else {
      console.log('No search query applied');
    }
 
    if (this.sortField) {
      console.log('Applying sort:', this.sortField, this.sortDirection);
      const header = this.headers.find(h => h.dataField === this.sortField);
      filteredData.sort((a, b) => {
        const valueA = a[this.sortField];
        const valueB = b[this.sortField];
        if (valueA == null) return this.sortDirection === 'asc' ? 1 : -1;
        if (valueB == null) return this.sortDirection === 'asc' ? -1 : 1;
        if (header?.dataType === 'number') {
          return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }
        if (header?.dataType === 'date') {
          return this.sortDirection === 'asc'
            ? new Date(valueA).getTime() - new Date(valueB).getTime()
            : new Date(valueB).getTime() - new Date(valueA).getTime();
        }
        return this.sortDirection === 'asc'
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      });
    } else {
      console.log('No sorting applied');
    }
 
    const startIndex = (this.currentPage - 1) * this.mobilePageSize;
    const endIndex = startIndex + this.mobilePageSize;
    this.paginatedData = filteredData.slice(startIndex, endIndex);
 
    console.log('Filtered data length:', filteredData.length);
    console.log('Paginated data length:', this.paginatedData.length);
    console.log('Paginated data sample:', this.paginatedData.slice(0, 2));
    console.log('Final card fields:', this.cardFields);
    console.log('========================');
    this.cdr.detectChanges();
  }
 
  private parseDateString(dateInput: any): Date | null {
    if (dateInput instanceof Date) {
      return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
    }
    if (typeof dateInput !== 'string') {
      console.warn('Non-string date input:', dateInput);
      return null;
    }
    let match = dateInput.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    match = dateInput.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    console.warn('Invalid date format:', dateInput);
    return null;
  }
 
  private applyDevExtremeFilter(data: any[], filter: any): any[] {
    if (!filter) {
      console.log('No filter provided, returning unfiltered data');
      return data;
    }
    console.log('=== APPLYING DEVEXTREME FILTER ===');
    console.log('Filter structure:', JSON.stringify(filter, null, 2));
 
    const applyFilter = (item: any, f: any): boolean => {
      if (Array.isArray(f[0])) {
        const operation = f[1]?.toLowerCase();
        if (operation === 'and') {
          return f.every((subFilter: any) => applyFilter(item, subFilter));
        } else if (operation === 'or') {
          return f.some((subFilter: any) => applyFilter(item, subFilter));
        }
        console.warn('Unknown group operation:', operation);
        return true;
      } else {
        const [field, operator, value] = f;
        const header = this.headers.find(h => h.dataField === field);
        if (!header) {
          console.warn(`No header found for field ${field}, skipping filter`);
          return true;
        }
        const itemValue = item[field];
        if (itemValue == null) {
          console.log(`Item value for ${field} is null/undefined`);
          return false;
        }
        const dataType = header.dataType || 'string';
        let normalizedItemValue = itemValue;
        let normalizedValue = value;
 
        if (dataType === 'date') {
          console.log(`Date filter for ${field}: value=${value}, type=${typeof value}, itemValue=`, itemValue);
          // Normalize itemValue to midnight
          normalizedItemValue = itemValue instanceof Date
            ? new Date(itemValue.getFullYear(), itemValue.getMonth(), itemValue.getDate()).getTime()
            : new Date(itemValue).getTime();
          const parsedDate = this.parseDateString(value);
          if (!parsedDate || isNaN(parsedDate.getTime())) {
            console.warn(`Invalid filter date for ${field}: ${value}`);
            return false;
          }
          normalizedValue = parsedDate.getTime();
          if (isNaN(normalizedItemValue)) {
            console.warn(`Invalid item date for ${field}: ${itemValue}`);
            return false;
          }
        } else if (dataType === 'number') {
          normalizedItemValue = Number(itemValue);
          normalizedValue = Number(value);
          if (isNaN(normalizedItemValue) || isNaN(normalizedValue)) {
            console.warn(`Invalid number values for ${field}: item=${itemValue}, filter=${value}`);
            return false;
          }
        } else {
          normalizedItemValue = String(itemValue).toLowerCase();
          normalizedValue = String(value).toLowerCase();
        }
 
        console.log(`Comparing ${field}: item=${normalizedItemValue}, filter=${normalizedValue}, operator=${operator}`);
        switch (operator) {
          case '=': return normalizedItemValue === normalizedValue;
          case 'contains': return normalizedItemValue.includes(normalizedValue);
          case '<>': return normalizedItemValue !== normalizedValue;
          case 'startswith': return normalizedItemValue.startsWith(normalizedValue);
          case 'endswith': return normalizedItemValue.endsWith(normalizedValue);
          case '<': return normalizedItemValue < normalizedValue;
          case '>': return normalizedItemValue > normalizedValue;
          case '<=': return normalizedItemValue <= normalizedValue;
          case '>=': return normalizedItemValue >= normalizedValue;
          default:
            console.warn(`Unknown operator ${operator}, returning true`);
            return true;
        }
      }
    };
 
    const result = data.filter(item => applyFilter(item, filter));
    console.log('Filtered result length:', result.length);
    console.log('Sample filtered result:', result.slice(0, 2));
    console.log('================================');
    return result;
  }
 
  private emitSelectionChange(): void {
    const selectedRowsData = this.data.filter(row =>
      this.selectedRowKeys.includes(String(row.id))
    );
    const event = {
      selectedRowKeys: [...this.selectedRowKeys],
      selectedRowsData: selectedRowsData
    };
    console.log('=== SELECTION CHANGE EMITTED ===');
    console.log('Selected keys:', event.selectedRowKeys);
    console.log('Selected data count:', event.selectedRowsData.length);
    console.log('Export filename:', this.exportFileName);
    console.log('================================');
    this.onSelectionChanged.emit(event);
  }
 
  openDetailsModal(contact: any): void {
    this.selectedContact = contact;
    this.isDetailsModalOpen = true;
    this.cdr.detectChanges();
  }
 
  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedContact = null;
    this.cdr.detectChanges();
  }
 
  toggleSortMobile(field: string): void {
    const header = this.headers.find(h => h.dataField === field);
    if (!header || header.allowSorting === false) return;
    if (this.sortField === field) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortField = '';
        this.sortDirection = '';
      }
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.updateMobileData();
    this.cdr.detectChanges();
  }
 
  getSortIndicator(field: string): string {
    if (this.sortField !== field) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
 
  searchMobile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
    this.currentPage = 1;
    this.updateMobileData();
    this.cdr.detectChanges();
  }
 
  toggleMobileFilterOptions(): void {
    this.showMobileFilterOptions = !this.showMobileFilterOptions;
    if (this.showMobileFilterOptions) {
      // Reset filterBuilderValue to avoid duplicate calendar rendering
      this.filterBuilderValue = [];
      console.log('Reset filterBuilderValue to prevent duplicate calendars');
    }
    this.showSortOptions = false;
    this.showColumnChooserMobile = false;
    this.showMobileExportOptions = false;
    this.cdr.detectChanges();
  }
 
  applyMobileFilters(): void {
    console.log('=== APPLY MOBILE FILTERS ===');
    console.log('Filter builder value:', this.filterBuilderValue);
    this.currentPage = 1;
    this.updateMobileData();
    this.cdr.detectChanges();
  }
 
  clearMobileFilters(): void {
    console.log('=== CLEAR MOBILE FILTERS ===');
    this.filterBuilderValue = [];
    this.searchQuery = '';
    this.filterValues = {};
    this.currentPage = 1;
    this.updateMobileData();
    this.cdr.detectChanges();
  }
 
  onFilterBuilderValueChanged(event: any): void {
    console.log('=== FILTER BUILDER VALUE CHANGED ===');
    console.log('New filter value:', JSON.stringify(event.value, null, 2));
    console.log('Value type:', event.value ? event.value.map((v: any) => typeof v) : 'null');
    console.log('==================================');
    this.filterBuilderValue = event.value || [];
    this.applyMobileFilters();
  }
 
  get totalPages(): number {
    if (!this.data || this.data.length === 0) {
      console.log('No data for totalPages calculation');
      return 1;
    }
    const filteredData = this.applyDevExtremeFilter([...this.data], this.filterBuilderValue.length > 0 ? this.filterBuilderValue : null)
      .filter(item => {
        if (!this.searchQuery) return true;
        return this.headers.some(header => {
          const field = header.dataField;
          const value = item[field];
          return value != null && String(value).toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      });
    const total = Math.ceil(filteredData.length / this.mobilePageSize);
    console.log('Total pages:', total);
    return total || 1;
  }
 
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateMobileData();
      this.cdr.detectChanges();
    }
  }
 
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateMobileData();
      this.cdr.detectChanges();
    }
  }
 
  toggleSelectAllOnPage(): void {
    const currentPageItems = this.paginatedData;
    const currentPageIds = currentPageItems.map(item => String(item.id));
    const allSelected = currentPageIds.every(id => this.selectedRowKeys.includes(id));
 
    if (allSelected) {
      this.selectedRowKeys = this.selectedRowKeys.filter(id => !currentPageIds.includes(id));
    } else {
      currentPageIds.forEach(id => {
        if (!this.selectedRowKeys.includes(id)) {
          this.selectedRowKeys.push(id);
        }
      });
    }
 
    this.emitSelectionChange();
    this.cdr.detectChanges();
  }
 
  areAllOnPageSelected(): boolean {
    const currentPageItems = this.paginatedData;
    const currentPageIds = currentPageItems.map(item => String(item.id));
    return currentPageIds.length > 0 && currentPageIds.every(id => this.selectedRowKeys.includes(id));
  }
 
  areSomeOnPageSelected(): boolean {
    const currentPageItems = this.paginatedData;
    const currentPageIds = currentPageItems.map(item => String(item.id));
    const selectedCount = currentPageIds.filter(id => this.selectedRowKeys.includes(id)).length;
    return selectedCount > 0 && selectedCount < currentPageIds.length;
  }
 
  toggleSelection(id: string): void {
    const stringId = String(id);
    const index = this.selectedRowKeys.indexOf(stringId);
   
    if (index === -1) {
      this.selectedRowKeys.push(stringId);
    } else {
      this.selectedRowKeys.splice(index, 1);
    }
 
    this.emitSelectionChange();
    this.cdr.detectChanges();
  }
 
  setPageSize(size: number): void {
    this.mobilePageSize = size;
    this.currentPage = 1;
    this.updateMobileData();
    this.cdr.detectChanges();
  }
 
  toggleColumnChooserMobile(): void {
    this.showColumnChooserMobile = !this.showColumnChooserMobile;
    this.showSortOptions = false;
    this.showMobileExportOptions = false;
    this.showMobileFilterOptions = false;
    this.cdr.detectChanges();
  }
 
  toggleMobileExportOptions(): void {
    this.showMobileExportOptions = !this.showMobileExportOptions;
    this.showSortOptions = false;
    this.showColumnChooserMobile = false;
    this.showMobileFilterOptions = false;
    this.cdr.detectChanges();
  }
 
  exportMobile(format: 'excel' | 'csv'): void {
    this.exportData(format);
    this.showMobileExportOptions = false;
    this.cdr.detectChanges();
  }
 
  private initializeHeaders(): void {
    this.headers = this.headers.map((header) => ({
      ...header,
      headerCellTemplate: 'headerCellTemplate',
      visible: header.visible !== false,
      allowSorting: header.allowSorting !== false,
      allowFiltering: header.allowFiltering !== false,
      dataType: header.dataType || 'string',
    }));
  }
 
  private initializeColumnVisibility(): void {
    console.log('=== INITIALIZE COLUMN VISIBILITY ===');
    this.headers.forEach((header) => {
      this.columnVisibility[header.dataField] = header.visible !== false;
      this.exportColumnVisibility[header.dataField] = header.visible !== false;
    });
    this.cardFields = this.headers
      .filter(header => header.visible !== false)
      .slice(0, 3)
      .map(header => header.dataField);
    console.log('Column visibility:', this.columnVisibility);
    console.log('Export column visibility:', this.exportColumnVisibility);
    console.log('Card fields:', this.cardFields);
    console.log('==================================');
  }
 
  toggleColumnChooser(event: Event): void {
    event.stopPropagation();
    this.showCustomColumnChooser = !this.showCustomColumnChooser;
    this.showExportModal = false;
    this.cdr.detectChanges();
  }
 
  toggleColumnVisibility(dataField: string): void {
    if (this.isMobile) {
      this.exportColumnVisibility[dataField] = !this.exportColumnVisibility[dataField];
    } else {
      this.columnVisibility[dataField] = !this.columnVisibility[dataField];
      if (this.dataGrid?.instance) {
        this.dataGrid.instance.columnOption(dataField, 'visible', this.columnVisibility[dataField]);
      }
    }
    console.log('=== COLUMN VISIBILITY CHANGED ===');
    console.log('Data field:', dataField);
    console.log('Mobile:', this.isMobile);
    console.log('Column visibility:', this.columnVisibility);
    console.log('Export column visibility:', this.exportColumnVisibility);
    console.log('===============================');
    if (!this.isMobile) {
      this.updateMobileData();
    }
  }
 
  areAllColumnsSelected(): boolean {
    const visibility = this.isMobile ? this.exportColumnVisibility : this.columnVisibility;
    return this.headers.every(header => visibility[header.dataField]);
  }
 
  areSomeColumnsSelected(): boolean {
    const visibility = this.isMobile ? this.exportColumnVisibility : this.columnVisibility;
    const visibleCount = this.headers.filter(header => visibility[header.dataField]).length;
    return visibleCount > 0 && visibleCount < this.headers.length;
  }
 
  toggleAllColumns(): void {
    const allSelected = this.areAllColumnsSelected();
    const visibility = this.isMobile ? this.exportColumnVisibility : this.columnVisibility;
    this.headers.forEach(header => {
      visibility[header.dataField] = !allSelected;
      if (!this.isMobile && this.dataGrid?.instance) {
        this.dataGrid.instance.columnOption(header.dataField, 'visible', !allSelected);
      }
    });
    console.log('=== TOGGLE ALL COLUMNS ===');
    console.log('All selected:', !allSelected);
    console.log('Mobile:', this.isMobile);
    console.log('Column visibility:', this.columnVisibility);
    console.log('Export column visibility:', this.exportColumnVisibility);
    console.log('=========================');
    if (!this.isMobile) {
      this.updateMobileData();
    }
  }
 
  onExportButtonClick(event: Event): void {
    event.stopPropagation();
    this.showExportModal = !this.showExportModal;
    this.showCustomColumnChooser = false;
    this.cdr.detectChanges();
  }
 
  exportData(format: 'excel' | 'csv'): void {
    this.closeDropdowns();
 
    const exportFormats: { [key: string]: ExportFormat } = {
      excel: { format: 'excel', fileType: 'xlsx', fileExtension: 'xlsx' },
      csv: { format: 'csv', fileType: 'csv', fileExtension: 'csv' },
    };
 
    const { fileType, fileExtension } = exportFormats[format];
    const workbook = XLSX.utils.book_new();
    const exportData: any[] = [];
 
    const visibleHeaders = this.headers.filter((header) =>
      this.isMobile ? this.exportColumnVisibility[header.dataField] : this.columnVisibility[header.dataField]
    );
    const headerRow = visibleHeaders.map((header) => header.caption);
    exportData.push(headerRow);
 
    let rowsToExport = this.data;
    if (this.selectedRowKeys.length > 0) {
      rowsToExport = this.data.filter((row) => this.selectedRowKeys.includes(String(row.id)));
    }
 
    rowsToExport.forEach((row) => {
      const rowData = visibleHeaders.map((header) => {
        const value = row[header.dataField] ?? 'N/A';
        if (header.dataType === 'date' && value instanceof Date) {
          return value.toLocaleDateString('en-US');
        }
        return value;
      });
      exportData.push(rowData);
    });
 
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
 
    if (format === 'excel') {
      for (let col = 0; col < headerRow.length; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        worksheet[cellAddress] = worksheet[cellAddress] || { v: headerRow[col] };
        worksheet[cellAddress].s = {
          fill: { fgColor: { rgb: '1976D2' } },
          font: { color: { rgb: 'FFFFFF' }, bold: true },
          alignment: { horizontal: 'center' },
        };
      }
      worksheet['!cols'] = headerRow.map(() => ({ wpx: 120 }));
    }
 
    XLSX.utils.book_append_sheet(workbook, worksheet, this.exportFileName);
 
    const fileName = `${this.exportFileName}.${fileExtension}`;
    const excelBuffer = XLSX.write(workbook, { bookType: fileType, type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, fileName);
 
    this.exportMessage = 'Export Completed';
    this.showExportMessage = true;
    setTimeout(() => {
      this.showExportMessage = false;
    }, 3000);
 
    this.cdr.detectChanges();
  }
 
  onExporting(event: any): void {
    event.cancel = true;
  }
 
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
 
  getOwnerColor(owner: string): string {
    if (!owner || typeof owner !== 'string') {
      return this.ownerColors[0];
    }
 
    const hash = this.hashString(owner.toLowerCase());
    const colorIndex = hash % this.ownerColors.length;
    return this.ownerColors[colorIndex];
  }
 
  getOwnerInitial(owner: string): string {
    if (!owner || typeof owner !== 'string') {
      return '';
    }
    return owner.charAt(0).toUpperCase();
  }
 
  getSortIcon(column: GridColumn): string {
    const sortOrder = column.sortOrder;
    if (sortOrder === 'asc') {
      return '↑';
    } else if (sortOrder === 'desc') {
      return '↓';
    }
    return '↕';
  }
 
  getSortIconClass(column: GridColumn): string {
    const sortOrder = column.sortOrder;
    return sortOrder ? 'sort-icon active' : 'sort-icon';
  }
 
  closeDropdowns(): void {
    this.showCustomColumnChooser = false;
    this.showExportModal = false;
    this.showMobileExportOptions = false;
    this.showSortOptions = false;
    this.showColumnChooserMobile = false;
    this.showMobileFilterOptions = false;
    this.cdr.detectChanges();
  }
 
  private configureDataGrid(): void {
    if (!this.dataGrid?.instance) return;
    this.dataGrid.instance.option('columnResizingMode', 'widget');
    this.headers.forEach((header) => {
      this.dataGrid.instance.columnOption(header.dataField, 'minWidth', 150);
      if (header.format) {
        this.dataGrid.instance.columnOption(header.dataField, 'format', header.format);
      }
      if (header.dataType) {
        this.dataGrid.instance.columnOption(header.dataField, 'dataType', header.dataType);
      }
    });
    if (this.headers.length > 0) {
      const firstColumnDataField = this.headers[0].dataField;
      this.dataGrid.instance.columnOption(firstColumnDataField, 'fixed', true);
      this.dataGrid.instance.columnOption(firstColumnDataField, 'fixedPosition', 'left');
    }
    this.dataGrid.instance.option('scrolling', {
      mode: 'standard',
      showScrollbar: 'always',
      useNative: true,
      scrollByContent: true,
      scrollByThumb: true,
    });
    this.dataGrid.instance.option('width', '100%');
    this.dataGrid.instance.refresh();
  }
 
  handleSelectionChanged(event: any): void {
    console.log('=== DESKTOP SELECTION EVENT ===');
    console.log('DevExtreme event:', event);
    console.log('Selected keys from DevExtreme:', event.selectedRowKeys);
    this.selectedRowKeys = (event.selectedRowKeys || []).map((key: any) => String(key));
    console.log('Normalized selected keys:', this.selectedRowKeys);
    console.log('Export filename:', this.exportFileName);
    console.log('==============================');
    this.emitSelectionChange();
    this.cdr.detectChanges();
  }
 
  toggleSort(column: GridColumn): void {
    if (column.allowSorting === false) return;
    const currentSortOrder = column.sortOrder;
    let newSortOrder: 'asc' | 'desc' | undefined;
 
    if (!currentSortOrder || currentSortOrder === 'desc') {
      newSortOrder = 'asc';
    } else if (currentSortOrder === 'asc') {
      newSortOrder = undefined;
    } else {
      newSortOrder = 'desc';
    }
 
    column.sortOrder = newSortOrder;
    if (!this.isMobile && this.dataGrid?.instance) {
      this.dataGrid.instance.clearSorting();
      this.headers.forEach((header) => {
        if (header.sortOrder) {
          this.dataGrid.instance.columnOption(header.dataField, 'sortOrder', header.sortOrder);
        }
      });
    }
  }
}