import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
  AfterViewInit
} from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface GridColumn {
  dataField: string;
  caption: string;
  visible?: boolean;
  sortOrder?: 'asc' | 'desc' | undefined;
  allowSorting?: boolean;
  allowFiltering?: boolean;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit {
  @Input() data: any[] = [];
  @Input() headers: GridColumn[] = [];
  @Input() exportFileName: string = 'Data';
  @Input() useOwnerTemplate: boolean = false;
  @Input() ownerField: string = '';

  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  @ViewChild('columnChooserButton') columnChooserButton!: ElementRef;
  @ViewChild('exportButton') exportButton!: ElementRef;
  @ViewChild('columnChooserDropdown') columnChooserDropdown!: ElementRef;
  @ViewChild('exportOptionsDropdown') exportOptionsDropdown!: ElementRef;
  showFilterRow: boolean = true;
  showHeaderFilter: boolean = true;
  

  pageSize: number = 10;
  allowedPageSizes = [5, 10, 15];

  showExportModal = false;
  showCustomColumnChooser = false;
  columnVisibility: { [key: string]: boolean } = {};
  selectedRowKeys: string[] = [];
  private clickedInsideDropdown = false;

  private readonly ownerColors = ['#2196f3', '#4caf50', '#9c27b0', '#1976d2', '#d32f2f', '#ff9800', '#673ab7', '#009688'];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const savedVisibility = localStorage.getItem('columnVisibility');
    if (savedVisibility) {
      this.columnVisibility = JSON.parse(savedVisibility);
      this.headers.forEach(header => {
        this.dataGrid.instance.columnOption(header.dataField, 'visible', this.columnVisibility[header.dataField]);
      });
    } else {
      this.headers.forEach(header => {
        this.columnVisibility[header.dataField] = header.visible !== false;
      });
    }
    this.setResponsiveOptions();
    window.addEventListener('resize', () => this.setResponsiveOptions());
  }

  setResponsiveOptions() {
    if (!this.dataGrid) return;
    const width = window.innerWidth;
    const grid = this.dataGrid.instance;

    grid.option('columnHidingEnabled', width <= 576);
    grid.option('columnAutoWidth', width > 576);

    if (width <= 576) this.pageSize = 5;
    else if (width <= 992) this.pageSize = 10;
    else this.pageSize = 15;
  }

  onExportButtonClick(event: any) {
    this.stopEventPropagation(event);
    this.showExportModal = !this.showExportModal;
    this.showCustomColumnChooser = false;
    this.clickedInsideDropdown = true;
    this.positionDropdown(this.exportButton, this.exportOptionsDropdown);
    this.cdr.detectChanges();
  }

  toggleColumnChooser(event: any) {
    this.stopEventPropagation(event);
    this.showCustomColumnChooser = !this.showCustomColumnChooser;
    this.showExportModal = false;
    this.clickedInsideDropdown = true;
    this.positionDropdown(this.columnChooserButton, this.columnChooserDropdown);
    this.cdr.detectChanges();
  }

  toggleColumnVisibility(dataField: string) {
    this.columnVisibility[dataField] = !this.columnVisibility[dataField];
    this.dataGrid.instance.columnOption(dataField, 'visible', this.columnVisibility[dataField]);
    localStorage.setItem('columnVisibility', JSON.stringify(this.columnVisibility));
  }

  onColumnChooserDropdownClick(event: any) {
    this.stopEventPropagation(event);
    this.clickedInsideDropdown = true;
  }

  onExportOptionsDropdownClick(event: any) {
    this.stopEventPropagation(event);
    this.clickedInsideDropdown = true;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.clickedInsideDropdown) {
      this.clickedInsideDropdown = false;
      return;
    }
    const target = event.target as HTMLElement;
    if (!this.columnChooserButton?.nativeElement.contains(target) && !this.columnChooserDropdown?.nativeElement.contains(target)) {
      this.showCustomColumnChooser = false;
    }
    if (!this.exportButton?.nativeElement.contains(target) && !this.exportOptionsDropdown?.nativeElement.contains(target)) {
      this.showExportModal = false;
    }
    this.cdr.detectChanges();
  }

  private positionDropdown(buttonRef: ElementRef, dropdownRef: ElementRef) {
    if (!buttonRef || !dropdownRef) return;
    const rect = buttonRef.nativeElement.getBoundingClientRect();
    const dropdown = dropdownRef.nativeElement;
    const top = rect.bottom + window.scrollY + 2;
    const right = document.documentElement.clientWidth - rect.right;
    dropdown.style.position = 'absolute';
    dropdown.style.top = `${top}px`;
    dropdown.style.right = `${right}px`;
  }

  stopEventPropagation(event: any) {
    if (event?.event) event.event.stopPropagation();
    else if (event?.stopPropagation) event.stopPropagation();
  }

  exportData(format: 'excel' | 'csv') {
    this.closeDropdowns();
    const visibleHeaders = this.headers.filter(h => this.columnVisibility[h.dataField]);
    const rowsToExport = this.selectedRowKeys.length > 0 ? this.data.filter(row => this.selectedRowKeys.includes(row.id)) : this.data;

    const headerRow = visibleHeaders.map(h => h.caption);
    const exportData = [headerRow, ...rowsToExport.map(row => visibleHeaders.map(h => row[h.dataField]))];

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.exportFileName);

    const fileExt = format === 'excel' ? 'xlsx' : 'csv';
    const buffer = XLSX.write(wb, { bookType: fileExt, type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${this.exportFileName}.${fileExt}`);
  }

  onExporting(event: any) {
    event.cancel = true;
  }

  closeDropdowns(event?: any) {
    this.stopEventPropagation(event);
    this.showCustomColumnChooser = false;
    this.showExportModal = false;
    this.clickedInsideDropdown = false;
    this.cdr.detectChanges();
  }

  getOwnerInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  getOwnerColor(name: string): string {
    if (!name) return this.ownerColors[0];
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.ownerColors[hash % this.ownerColors.length];
  }

  handleSelectionChanged(event: any) {
    this.selectedRowKeys = event.selectedRowKeys;
  }
}
