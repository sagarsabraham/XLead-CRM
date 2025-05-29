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
}
 
export interface ExportFormat {
  format: string;
  fileType: BookType;
  fileExtension: string;
}