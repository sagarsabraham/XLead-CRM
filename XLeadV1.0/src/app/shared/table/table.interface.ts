export interface GridColumn {
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

export interface ExportFormat {
  format: 'excel' | 'csv';
  fileType: 'xlsx' | 'csv';
  fileExtension: 'xlsx' | 'csv';
}