import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
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
  @Output() onSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  @ViewChild('columnChooserButton', { static: false }) columnChooserButton!: ElementRef;
  @ViewChild('exportButton', { static: false }) exportButton!: ElementRef;
  @ViewChild('columnChooserDropdown', { static: false }) columnChooserDropdown!: ElementRef;
  @ViewChild('exportOptionsDropdown', { static: false }) exportOptionsDropdown!: ElementRef;

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
  private clickedInsideDropdown: boolean = false;

  private readonly ownerColors: readonly string[] = [
    '#2196f3',
    '#4caf50',
    '#9c27b0',
    '#1976d2',
    '#d32f2f',
    '#ff9800',
    '#673ab7',
    '#009688',
  ];

  isMobile: boolean = false;
  showSortOptions: boolean = false;
  showColumnChooserMobile: boolean = false;
  showMobileExportOptions: boolean = false;
  selectedContact: any = null;
  isDetailsModalOpen: boolean = false;
  sortField: string = '';
  sortDirection: string = '';
  searchQuery: string = '';
  currentPage: number = 1;
  mobilePageSize: number = 10;
  mobileAllowedPageSizes: number[] = [5, 10, 20];
  paginatedData: any[] = []; // Now a regular class property

  constructor(private cdr: ChangeDetectorRef) {
    this.initializeHeaders();
  }

  ngOnInit() {
    this.checkIfMobile();
  }

  ngAfterViewInit(): void {
    this.initializeColumnVisibility();
    if (!this.isMobile && this.dataGrid?.instance) {
      this.configureDataGrid();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.checkIfMobile();
    this.onResizeOrScroll();
    this.cdr.detectChanges();
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 576;
    if (!this.isMobile) {
      this.showSortOptions = false;
      this.showColumnChooserMobile = false;
      this.showMobileExportOptions = false;
      this.isDetailsModalOpen = false;
      this.selectedContact = null;
    }
    this.updatePagination();
  }

  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.mobilePageSize;
    const endIndex = startIndex + this.mobilePageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
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

    if (this.sortField) {
      this.data = [...this.data].sort((a, b) => {
        const valueA = a[this.sortField];
        const valueB = b[this.sortField];
        const direction = this.sortDirection === 'asc' ? 1 : -1;

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueA.localeCompare(valueB) * direction;
        }
        return (valueA - valueB) * direction;
      });
    }
    this.currentPage = 1;
    this.updatePagination();
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
    this.updatePagination();
    this.cdr.detectChanges();
  }

  get filteredData(): any[] {
    if (!this.searchQuery) return this.data;

    return this.data.filter(item => {
      return this.headers.some(header => {
        if (!this.columnVisibility[header.dataField]) return false;
        const value = item[header.dataField];
        return value && String(value).toLowerCase().includes(this.searchQuery);
      });
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.mobilePageSize);
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
      this.cdr.detectChanges();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
      this.cdr.detectChanges();
    }
  }

  toggleSelectAllOnPage(): void {
    const currentPageItems = this.paginatedData;
    const allSelected = currentPageItems.every(item => this.selectedRowKeys.includes(item.id));

    if (allSelected) {
      this.selectedRowKeys = this.selectedRowKeys.filter(id => !currentPageItems.some(item => item.id === id));
    } else {
      currentPageItems.forEach(item => {
        if (!this.selectedRowKeys.includes(item.id)) {
          this.selectedRowKeys.push(item.id);
        }
      });
    }

    this.onSelectionChanged.emit({
      selectedRowKeys: this.selectedRowKeys
    });
    this.cdr.detectChanges();
  }

  areAllOnPageSelected(): boolean {
    const currentPageItems = this.paginatedData;
    return currentPageItems.length > 0 && currentPageItems.every(item => this.selectedRowKeys.includes(item.id));
  }

  areSomeOnPageSelected(): boolean {
    const currentPageItems = this.paginatedData;
    const selectedCount = currentPageItems.filter(item => this.selectedRowKeys.includes(item.id)).length;
    return selectedCount > 0 && selectedCount < currentPageItems.length;
  }

  toggleSelection(id: string): void {
    const index = this.selectedRowKeys.indexOf(id);
    if (index === -1) {
      this.selectedRowKeys.push(id);
    } else {
      this.selectedRowKeys.splice(index, 1);
    }

    this.onSelectionChanged.emit({
      selectedRowKeys: this.selectedRowKeys
    });
    this.cdr.detectChanges();
  }

  setPageSize(size: number): void {
    this.mobilePageSize = size;
    this.currentPage = 1;
    this.updatePagination();
    this.cdr.detectChanges();
  }

  toggleColumnChooserMobile(): void {
    this.showColumnChooserMobile = !this.showColumnChooserMobile;
    this.showSortOptions = false;
    this.showMobileExportOptions = false;
    this.cdr.detectChanges();
  }

  toggleMobileExportOptions(): void {
    this.showMobileExportOptions = !this.showMobileExportOptions;
    this.showSortOptions = false;
    this.showColumnChooserMobile = false;
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
      visible: true,
      allowSorting: header.allowSorting !== false,
      allowFiltering: header.allowFiltering !== false,
    }));
  }

  private initializeColumnVisibility(): void {
    const savedVisibility = localStorage.getItem('columnVisibility');
    if (savedVisibility) {
      this.columnVisibility = JSON.parse(savedVisibility);
      if (!this.isMobile && this.dataGrid?.instance) {
        this.headers.forEach((header) => {
          this.dataGrid.instance.columnOption(header.dataField, 'visible', this.columnVisibility[header.dataField]);
        });
      }
    } else {
      this.headers.forEach((header) => {
        this.columnVisibility[header.dataField] = header.visible !== false;
      });
    }
  }

  toggleColumnChooser(event: Event): void {
    event.stopPropagation();
    this.showCustomColumnChooser = !this.showCustomColumnChooser;
    this.showExportModal = false;
    this.clickedInsideDropdown = true;

    if (this.showCustomColumnChooser) {
      setTimeout(() => this.positionDropdown(this.columnChooserButton, this.columnChooserDropdown));
    }

    this.cdr.detectChanges();
  }

  toggleColumnVisibility(dataField: string): void {
    this.columnVisibility[dataField] = !this.columnVisibility[dataField];
    if (!this.isMobile && this.dataGrid?.instance) {
      this.dataGrid.instance.columnOption(dataField, 'visible', this.columnVisibility[dataField]);
    }
    localStorage.setItem('columnVisibility', JSON.stringify(this.columnVisibility));
    this.clickedInsideDropdown = true;
    this.cdr.detectChanges();
  }

  areAllColumnsSelected(): boolean {
    return this.headers.every(header => this.columnVisibility[header.dataField]);
  }

  areSomeColumnsSelected(): boolean {
    const visibleCount = this.headers.filter(header => this.columnVisibility[header.dataField]).length;
    return visibleCount > 0 && visibleCount < this.headers.length;
  }

  toggleAllColumns(): void {
    const allSelected = this.areAllColumnsSelected();
    this.headers.forEach(header => {
      this.columnVisibility[header.dataField] = !allSelected;
      if (!this.isMobile && this.dataGrid?.instance) {
        this.dataGrid.instance.columnOption(header.dataField, 'visible', !allSelected);
      }
    });
    localStorage.setItem('columnVisibility', JSON.stringify(this.columnVisibility));
    this.clickedInsideDropdown = true;
    this.cdr.detectChanges();
  }

  onExportButtonClick(event: Event): void {
    event.stopPropagation();
    this.showExportModal = !this.showExportModal;
    this.showCustomColumnChooser = false;
    this.clickedInsideDropdown = true;

    if (this.showExportModal) {
      setTimeout(() => this.positionDropdown(this.exportButton, this.exportOptionsDropdown));
    } else {
      this.closeDropdowns();
    }

    this.cdr.detectChanges();
  }

  onColumnChooserDropdownClick(event: Event): void {
    event.stopPropagation();
    this.clickedInsideDropdown = true;
  }

  onExportOptionsDropdownClick(event: Event): void {
    event.stopPropagation();
    this.clickedInsideDropdown = true;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.clickedInsideDropdown) {
      this.clickedInsideDropdown = false;
      return;
    }

    const clickedOnColumnChooserButton = this.columnChooserButton?.nativeElement?.contains(target);
    const clickedOnExportButton = this.exportButton?.nativeElement?.contains(target);
    const clickedInColumnChooser = this.columnChooserDropdown?.nativeElement?.contains(target);
    const clickedInExportDropdown = this.exportOptionsDropdown?.nativeElement?.contains(target);

    if (this.showCustomColumnChooser && !clickedOnColumnChooserButton && !clickedInColumnChooser) {
      this.showCustomColumnChooser = false;
      this.cdr.detectChanges();
    }

    if (this.showExportModal && !clickedOnExportButton && !clickedInExportDropdown) {
      this.showExportModal = false;
      this.cdr.detectChanges();
    }
  }

  @HostListener('window:scroll')
  onResizeOrScroll(): void {
    if (this.showCustomColumnChooser) {
      this.positionDropdown(this.columnChooserButton, this.columnChooserDropdown);
    }
    if (this.showExportModal) {
      this.positionDropdown(this.exportButton, this.exportOptionsDropdown);
    }
  }

  handleSelectionChanged(event: any): void {
    this.selectedRowKeys = event.selectedRowKeys || [];
    this.onSelectionChanged.emit(event);
    this.cdr.detectChanges();
  }

  toggleSort(column: GridColumn): void {
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

  exportData(format: 'excel' | 'csv'): void {
    this.closeDropdowns();

    const exportFormats: { [key: string]: ExportFormat } = {
      excel: { format: 'excel', fileType: 'xlsx', fileExtension: 'xlsx' },
      csv: { format: 'csv', fileType: 'csv', fileExtension: 'csv' },
    };

    const { fileType, fileExtension } = exportFormats[format];
    const workbook = XLSX.utils.book_new();
    const exportData: any[] = [];

    const visibleHeaders = this.headers.filter((header) => this.columnVisibility[header.dataField]);
    const headerRow = visibleHeaders.map((header) => header.caption);
    exportData.push(headerRow);

    let rowsToExport = this.data;
    if (this.selectedRowKeys.length > 0) {
      rowsToExport = this.data.filter((row) => this.selectedRowKeys.includes(row.id));
    }

    rowsToExport.forEach((row) => {
      const rowData = visibleHeaders.map((header) => row[header.dataField] ?? 'N/A');
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

  private positionDropdown(buttonRef: ElementRef, dropdownRef: ElementRef): void {
    if (!buttonRef || !dropdownRef) {
      return;
    }

    const button = buttonRef.nativeElement as HTMLElement;
    const dropdown = dropdownRef.nativeElement as HTMLElement;
    const rect = button.getBoundingClientRect();
    const dropdownWidth = dropdown.offsetWidth || 150; // Fallback to CSS width if not rendered
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dropdownHeight = dropdown.offsetHeight || 300; // Fallback to CSS max-height if not rendered

    // Position below the button using `left`
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY + 5; // 5px gap below the button

    // Prevent overflow on the right
    if (left + dropdownWidth > viewportWidth) {
      left = rect.right + window.scrollX - dropdownWidth;
    }

    // Prevent overflow on the left
    if (left < 0) {
      left = 0;
    }

    // Check if dropdown overflows at the bottom
    if (top + dropdownHeight > viewportHeight + window.scrollY) {
      // Position above the button if it overflows
      const topAbove = rect.top + window.scrollY - dropdownHeight - 5;
      dropdown.style.top = `${topAbove}px`;
    } else {
      dropdown.style.top = `${top}px`;
    }

    // Apply styles
    dropdown.style.position = 'absolute';
    dropdown.style.left = `${left}px`;
    dropdown.style.right = ''; // Override the static `right` from CSS
  }

  closeDropdowns(): void {
    this.showCustomColumnChooser = false;
    this.showExportModal = false;
    this.showMobileExportOptions = false;
    this.showSortOptions = false;
    this.showColumnChooserMobile = false;
    this.clickedInsideDropdown = false;
    this.cdr.detectChanges();
  }

  private configureDataGrid(): void {
    if (!this.dataGrid?.instance) {
      return;
    }

    this.dataGrid.instance.option('columnResizingMode', 'widget');

    this.headers.forEach((header) => {
      this.dataGrid.instance.columnOption(header.dataField, 'minWidth', 150);
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
}