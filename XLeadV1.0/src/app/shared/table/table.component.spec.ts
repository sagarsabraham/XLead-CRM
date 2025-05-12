import { Component, Input, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';

// Define a custom interface for the grid columns
interface GridColumn {
  dataField: string;
  caption: string;
  width?: number;
  allowSorting?: boolean;
  alignment?: 'left' | 'right' | 'center';
  cellTemplate?: string;
  headerCellTemplate?: string;
}

@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.css']
})
export class ContactsTableComponent {
  @Input() data: any[] = [];
  @Input() headers: GridColumn[] = [];
  @Input('class') classNames = '';

  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;

  pageSize = 10;
  allowedPageSizes = [5, 10, 20];

  selectedRowKeys: string[] = [];
  showPopup = false;
  popupPosition: any = { x: 0, y: 0 };
  currentColumn: any = null;
  filterValue: string = '';

  constructor() {
    // Apply the custom header template to all columns
    this.headers = this.headers.map(header => ({
      ...header,
      headerCellTemplate: 'headerCellTemplate'
    }));
  }

  onSelectionChanged(e: any) {
    this.selectedRowKeys = e.selectedRowKeys;
    console.log('Selected rows:', this.selectedRowKeys);
  }

  getOwnerClass(owner: string): string {
    return 'owner-' + owner.toLowerCase();
  }

  getOwnerInitial(owner: string): string {
    return owner.charAt(0).toUpperCase();
  }

  openSortFilterMenu(event: MouseEvent, header: any) {
    event.stopPropagation();
    this.currentColumn = header.column;
    this.popupPosition = { x: event.clientX, y: event.clientY };
    this.showPopup = true;
  }

  sortAscending() {
    if (this.currentColumn) {
      this.dataGrid.instance.clearSorting();
      this.dataGrid.instance.columnOption(this.currentColumn.dataField, 'sortOrder', 'asc');
      this.showPopup = false;
    }
  }

  sortDescending() {
    if (this.currentColumn) {
      this.dataGrid.instance.clearSorting();
      this.dataGrid.instance.columnOption(this.currentColumn.dataField, 'sortOrder', 'desc');
      this.showPopup = false;
    }
  }

  applyFilter() {
    if (this.currentColumn && this.filterValue) {
      this.dataGrid.instance.columnOption(this.currentColumn.dataField, 'filterValue', this.filterValue);
      this.showPopup = false;
      this.filterValue = '';
    }
  }

  clearFilter() {
    if (this.currentColumn) {
      this.dataGrid.instance.columnOption(this.currentColumn.dataField, 'filterValue', null);
      this.showPopup = false;
      this.filterValue = '';
    }
  }
}