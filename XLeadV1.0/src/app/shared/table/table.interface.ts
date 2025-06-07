import { BookType } from 'xlsx';
export interface GridColumn {
  dataField: string;
  caption: string;
  visible?: boolean;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  allowEditing?: boolean; // Add this property
  cellTemplate?: string;
  headerCellTemplate?: string;
  sortOrder?: 'asc' | 'desc' | undefined;
  //  dataType?: 'string' | 'number' | 'date' | 'boolean';
  //    format?: { type?: string; currency?: string; precision?: number } | string;
  //     minWidth?: number;
}
 
export interface ExportFormat {
  format: string;
  fileType: BookType;
  fileExtension: string;
}