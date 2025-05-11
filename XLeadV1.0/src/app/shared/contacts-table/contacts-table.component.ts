import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface GridColumn {
  dataField: string;
  caption: string;
  width?: number;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  alignment?: 'left' | 'right' | 'center';
  cellTemplate?: string;
  headerCellTemplate?: string;
  visible?: boolean;
  sortOrder?: 'asc' | 'desc' | undefined;
}

interface ExportFormat {
  format: 'excel' | 'csv';
  fileType: 'xlsx' | 'csv';
  fileExtension: 'xlsx' | 'csv';
}

@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.css'],
})
export class ContactsTableComponent implements AfterViewInit, OnDestroy {
  @Input() data: any[] = [];
  @Input() headers: GridColumn[] = [];
  @Input() classNames: string = '';

  @Output() onSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  @ViewChild('columnChooserButton', { static: false }) columnChooserButton!: ElementRef;
  @ViewChild('exportButton', { static: false }) exportButton!: ElementRef;
  @ViewChild('columnChooserDropdown', { static: false }) columnChooserDropdown!: ElementRef;
  @ViewChild('exportOptionsDropdown', { static: false }) exportOptionsDropdown!: ElementRef;

  pageSize: number = 10;
  allowedPageSizes: number[] = [5, 10, 20];
  selectedRowKeys: string[] = [];
  totalContacts: number = 0;
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

  private readonly ownerColors: string[] = [
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
    this.headers = this.headers.map((header) => ({
      ...header,
      headerCellTemplate: 'headerCellTemplate',
      visible: true,
      allowSorting: header.allowSorting !== false,
      allowFiltering: header.allowFiltering !== false,
    }));
  }

  ngAfterViewInit(): void {
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
    this.updateTotalContacts();
  }

  ngOnDestroy(): void {}

  /**
   * Updates the total contacts count based on the visible rows after filtering.
   */
  updateTotalContacts(): void {
    this.dataGrid.instance.getDataSource().store().totalCount({}).then((count: number) => {
      this.totalContacts = count;
      this.cdr.detectChanges();
    });
  }

  /**
   * Toggles the visibility of the column chooser dropdown.
   * @param event - The event object from the button click.
   */
  toggleColumnChooser = (event: any): void => {
    this.stopEventPropagation(event);
    this.showCustomColumnChooser = !this.showCustomColumnChooser;
    this.showExportModal = false;
    this.clickedInsideDropdown = true;

    if (this.showCustomColumnChooser) {
      setTimeout(() => {
        this.positionDropdown(this.columnChooserButton, this.columnChooserDropdown);
      });
    }

    this.cdr.detectChanges();
  };

  /**
   * Toggles the visibility of a column in the grid.
   * @param dataField - The data field of the column to toggle.
   */
  toggleColumnVisibility = (dataField: string): void => {
    this.columnVisibility[dataField] = !this.columnVisibility[dataField];
    this.dataGrid.instance.columnOption(dataField, 'visible', this.columnVisibility[dataField]);
    localStorage.setItem('columnVisibility', JSON.stringify(this.columnVisibility));
    this.clickedInsideDropdown = true;
    this.updateTotalContacts();
  };

  /**
   * Toggles the export options dropdown.
   * @param event - The event object from the button click.
   */
  onExportButtonClick = (event: any): void => {
    this.stopEventPropagation(event);
    this.showExportModal = !this.showExportModal;
    this.showCustomColumnChooser = false;
    this.clickedInsideDropdown = true;

    if (this.showExportModal) {
      setTimeout(() => {
        this.positionDropdown(this.exportButton, this.exportOptionsDropdown);
      });
    } else {
      this.closeDropdowns(event);
    }

    this.cdr.detectChanges();
  };

  /**
   * Positions a dropdown below its corresponding button.
   * @param buttonRef - Reference to the button element.
   * @param dropdownRef - Reference to the dropdown element.
   */
  private positionDropdown = (buttonRef: ElementRef, dropdownRef: ElementRef): void => {
    if (!buttonRef || !dropdownRef) {
      return;
    }

    const button = buttonRef.nativeElement;
    const dropdown = dropdownRef.nativeElement;
    const rect = button.getBoundingClientRect();
    const dropdownHeight = dropdown.offsetHeight;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + window.scrollY + 2;
    const rightOffset = document.documentElement.clientWidth - rect.right;

    if (rect.bottom + dropdownHeight > viewportHeight) {
      top = rect.top + window.scrollY - dropdownHeight - 2;
    }

    dropdown.style.position = 'absolute';
    dropdown.style.top = `${top}px`;
    dropdown.style.right = `${rightOffset}px`;
  };

  /**
   * Handles clicks inside the column chooser dropdown to prevent it from closing.
   * @param event - The click event.
   */
  onColumnChooserDropdownClick = (event: any): void => {
    this.stopEventPropagation(event);
    this.clickedInsideDropdown = true;
  };

  /**
   * Handles clicks inside the export options dropdown to prevent it from closing.
   * @param event - The click event.
   */
  onExportOptionsDropdownClick = (event: any): void => {
    this.stopEventPropagation(event);
    this.clickedInsideDropdown = true;
  };

  @HostListener('document:click', ['$event'])
  onDocumentClick = (event: MouseEvent): void => {
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
  };

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onResizeOrScroll = (): void => {
    if (this.showCustomColumnChooser) {
      this.positionDropdown(this.columnChooserButton, this.columnChooserDropdown);
    }
    if (this.showExportModal) {
      this.positionDropdown(this.exportButton, this.exportOptionsDropdown);
    }
  };

  /**
   * Emits the selection changed event when the grid selection changes.
   * @param event - The selection changed event from the grid.
   */
  handleSelectionChanged = (event: any): void => {
    this.selectedRowKeys = event.selectedRowKeys;
    this.onSelectionChanged.emit(event);
    this.updateTotalContacts();
  };

  /**
   * Generates a hash from a string to consistently map owner names to colors.
   * @param str - The string to hash (owner name).
   * @returns A numeric hash value.
   */
  private hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  /**
   * Gets the background color for an owner's avatar based on their name.
   * @param owner - The owner's name.
   * @returns The hex color code for the avatar.
   */
  getOwnerColor = (owner: string): string => {
    if (!owner || typeof owner !== 'string') {
      return this.ownerColors[0];
    }

    const hash = this.hashString(owner.toLowerCase());
    const colorIndex = hash % this.ownerColors.length;
    return this.ownerColors[colorIndex];
  };

  /**
   * Gets the initial letter of the owner's name for display in the avatar.
   * @param owner - The owner's name.
   * @returns The uppercase initial letter, or an empty string if invalid.
   */
  getOwnerInitial = (owner: string): string => {
    if (!owner || typeof owner !== 'string') {
      return '';
    }
    return owner.charAt(0).toUpperCase();
  };

  /**
   * Toggles sorting on a column.
   * @param column - The column to sort.
   */
  toggleSort = (column: GridColumn): void => {
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
    this.updateTotalContacts();
  };

  /**
   * Gets the sort icon for a column based on its sort order.
   * @param column - The column to get the sort icon for.
   * @returns The sort icon character.
   */
  getSortIcon = (column: GridColumn): string => {
    const sortOrder = column.sortOrder;
    if (sortOrder === 'asc') {
      return '↑';
    } else if (sortOrder === 'desc') {
      return '↓';
    }
    return '↕';
  };

  /**
   * Gets the CSS class for the sort icon based on the column's sort order.
   * @param column - The column to get the sort icon class for.
   * @returns The CSS class for the sort icon.
   */
  getSortIconClass = (column: GridColumn): string => {
    const sortOrder = column.sortOrder;
    return sortOrder ? 'sort-icon active' : 'sort-icon';
  };

  /**
   * Exports the grid data to the specified format (Excel or CSV).
   * @param format - The format to export to ('excel' or 'csv').
   */
  exportData = (format: 'excel' | 'csv'): void => {
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

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

    const fileName = `Contacts.${fileExtension}`;
    const excelBuffer = XLSX.write(workbook, { bookType: fileType, type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, fileName);

    this.exportMessage = 'Export Completed';
    this.showExportMessage = true;
    setTimeout(() => {
      this.showExportMessage = false;
    }, 3000);
  };

  /**
   * Cancels the default DevExtreme export behavior.
   * @param event - The exporting event.
   */
  onExporting = (event: any): void => {
    event.cancel = true;
  };

  /**
   * Closes both the column chooser and export dropdowns.
   * @param event - The event object (optional).
   */
  closeDropdowns = (event?: any): void => {
    this.stopEventPropagation(event);
    this.showCustomColumnChooser = false;
    this.showExportModal = false;
    this.clickedInsideDropdown = false;
    this.cdr.detectChanges();
  };

  /**
   * Stops event propagation for both standard DOM and DevExtreme events.
   * @param event - The event object.
   */
  private stopEventPropagation = (event: any): void => {
    if (event?.event) {
      event.event.stopPropagation();
    } else if (event?.stopPropagation) {
      event.stopPropagation();
    }
  };
}