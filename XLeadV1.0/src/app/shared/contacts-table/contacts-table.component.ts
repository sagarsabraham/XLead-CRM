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
}