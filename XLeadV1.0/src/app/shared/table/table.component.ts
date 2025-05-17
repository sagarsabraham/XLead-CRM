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
  // Inputs and Outputs
  @Input() data: any[] = [];
  @Input() headers: GridColumn[] = [];
  @Input() classNames: string = '';
  @Input() useOwnerTemplate: boolean = true;
  @Input() ownerField: string = 'owner';
  @Input() exportFileName: string = 'Data';
  @Output() onSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

  // ViewChild References
  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  @ViewChild('columnChooserButton', { static: false }) columnChooserButton!: ElementRef;
  @ViewChild('exportButton', { static: false }) exportButton!: ElementRef;
  @ViewChild('columnChooserDropdown', { static: false }) columnChooserDropdown!: ElementRef;
  @ViewChild('exportOptionsDropdown', { static: false }) exportOptionsDropdown!: ElementRef;

  // Component State
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
    '#2196f3', // Blue
    '#4caf50', // Green
    '#9c27b0', // Purple
    '#1976d2', // Dark Blue
    '#d32f2f', // Red
    '#ff9800', // Orange
    '#673ab7', // Deep Purple
    '#009688', // Teal
  ];

  constructor(private cdr: ChangeDetectorRef) {
    this.initializeHeaders();
  }

  ngAfterViewInit(): void {
    this.initializeColumnVisibility();
    this.configureDataGrid();
  }

  // Lifecycle Methods
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
      this.headers.forEach((header) => {
        this.dataGrid.instance.columnOption(header.dataField, 'visible', this.columnVisibility[header.dataField]);
      });
    } else {
      this.headers.forEach((header) => {
        this.columnVisibility[header.dataField] = header.visible !== false;
      });
    }
  }

  private configureDataGrid(): void {
    if (!this.dataGrid?.instance) {
      return;
    }

    this.dataGrid.instance.option('columnResizingMode', 'widget');

    // Set minimum width for all columns
    this.headers.forEach((header) => {
      this.dataGrid.instance.columnOption(header.dataField, 'minWidth', 150);
    });

    // Configure the first column to be sticky on the left
    if (this.headers.length > 0) {
      const firstColumnDataField = this.headers[0].dataField;
      this.dataGrid.instance.columnOption(firstColumnDataField, 'fixed', true);
      this.dataGrid.instance.columnOption(firstColumnDataField, 'fixedPosition', 'left');
    }

    // Configure scrolling options
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

  // Event Handlers
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
    this.dataGrid.instance.columnOption(dataField, 'visible', this.columnVisibility[dataField]);
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

  // Toggles visibility of all columns in the column chooser dropdown
  toggleAllColumns(): void {
    const allSelected = this.areAllColumnsSelected();
    this.headers.forEach(header => {
      this.columnVisibility[header.dataField] = !allSelected;
      this.dataGrid.instance.columnOption(header.dataField, 'visible', !allSelected);
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

  @HostListener('window:resize')
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
    this.selectedRowKeys = event.selectedRowKeys;
    this.onSelectionChanged.emit(event);
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
    this.dataGrid.instance.clearSorting();
    this.headers.forEach((header) => {
      if (header.sortOrder) {
        this.dataGrid.instance.columnOption(header.dataField, 'sortOrder', header.sortOrder);
      }
    });
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
      const rowData = visibleHeaders.map((header) => row[header.dataField]);
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
  }

  onExporting(event: any): void {
    event.cancel = true;
  }

  // Utility Methods
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

  // Positions a dropdown relative to its button
  private positionDropdown(buttonRef: ElementRef, dropdownRef: ElementRef): void {
    if (!buttonRef || !dropdownRef) {
      return;
    }

    const button = buttonRef.nativeElement;
    const dropdown = dropdownRef.nativeElement;
    const rect = button.getBoundingClientRect();
    const dropdownHeight = dropdown.offsetHeight;
    const viewportHeight = window.innerHeight;

    const top = rect.bottom + window.scrollY + 2 > rect.top + window.scrollY - dropdownHeight - 2
      ? rect.bottom + window.scrollY + 2
      : rect.top + window.scrollY - dropdownHeight - 2;

    const rightOffset = document.documentElement.clientWidth - rect.right;

    dropdown.style.position = 'absolute';
    dropdown.style.top = `${top}px`;
    dropdown.style.right = `${rightOffset}px`;
  }

  closeDropdowns(): void {
    this.showCustomColumnChooser = false;
    this.showExportModal = false;
    this.clickedInsideDropdown = false;
    this.cdr.detectChanges();
  }
}