import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef, ElementRef, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DxDataGridComponent, DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';

import { TableComponent } from './table.component';
import { GridColumn } from './table.interface';

// --- Stub Component for app-table-outline ---
@Component({
  selector: 'app-table-outline',
  template: '',
})
class TableOutlineStubComponent {}

// --- Mocks ---
class MockDxDataGridInstance {
  columnOption = jasmine.createSpy('columnOption').and.returnValue(Promise.resolve());
  clearSorting = jasmine.createSpy('clearSorting').and.returnValue(Promise.resolve());
  refresh = jasmine.createSpy('refresh').and.returnValue(Promise.resolve());
  option = jasmine.createSpy('option').and.returnValue(Promise.resolve());
}

class MockElementRef implements ElementRef {
  nativeElement: {
    getBoundingClientRect: () => any;
    offsetHeight: number;
    offsetWidth: number;
    contains: (target: any) => boolean;
    style: Partial<CSSStyleDeclaration>;
  };

  constructor() {
    this.nativeElement = {
      getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue(
        { left: 10, bottom: 50, right: 100, top: 20, width: 90, height: 30 }
      ),
      offsetHeight: 30,
      offsetWidth: 150,
      contains: jasmine.createSpy('contains').and.returnValue(false),
      style: {}
    };
  }
}

let mockSaveAs: jasmine.Spy;
let mockXLSXUtilsBookNew: jasmine.Spy;
let mockXLSXUtilsAoaToSheet: jasmine.Spy;
let mockXLSXUtilsBookAppendSheet: jasmine.Spy;
let mockXLSXWrite: jasmine.Spy;
let mockDocumentElementSetProperty: jasmine.Spy;
let mockDocumentQuerySelector: jasmine.Spy;

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let mockDataGridInstance: MockDxDataGridInstance;
  let mockCdr: jasmine.SpyObj<ChangeDetectorRef>;

  const sampleHeaders: GridColumn[] = [
    { dataField: 'id', caption: 'ID', visible: true, allowSorting: true, allowFiltering: true },
    { dataField: 'name', caption: 'Full Name', visible: true, allowSorting: true, allowFiltering: true },
    { dataField: 'email', caption: 'Email Address', visible: true, allowSorting: false, allowFiltering: true },
    { dataField: 'company', caption: 'Company', visible: false, allowSorting: true, allowFiltering: false },
  ];
  const sampleData = [
    { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', company: 'Tech Corp', owner: 'Manager A' },
    { id: '2', name: 'Bob The Builder', email: 'bob@example.com', company: 'Innovate LLC', owner: 'Manager B' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', company: 'Old Solutions', owner: 'Manager A' },
  ];

  function createMockHtmlElement(properties: Partial<HTMLElement> = {}): HTMLElement {
    const el = document.createElement('div');
    Object.entries(properties).forEach(([key, value]) => {
      Object.defineProperty(el, key, { configurable: true, value: value });
    });
    return el;
  }

  mockCdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
  beforeEach(async () => {
    mockDataGridInstance = new MockDxDataGridInstance();

    // Create a stub for XLSX
    const XLSXStub = {
      utils: {
        book_new: jasmine.createSpy('book_new').and.returnValue({} as XLSX.WorkBook),
        aoa_to_sheet: jasmine.createSpy('aoa_to_sheet').and.returnValue({} as XLSX.WorkSheet),
        book_append_sheet: jasmine.createSpy('book_append_sheet'),
      },
      write: jasmine.createSpy('write').and.returnValue(new ArrayBuffer(8)),
    };

    // Assign spies to existing mock variables
    mockXLSXUtilsBookNew = XLSXStub.utils.book_new;
    mockXLSXUtilsAoaToSheet = XLSXStub.utils.aoa_to_sheet;
    mockXLSXUtilsBookAppendSheet = XLSXStub.utils.book_append_sheet;
    mockXLSXWrite = XLSXStub.write;

    // Mock saveAs
    mockSaveAs = spyOn(window, 'saveAs');

    // Mock document element style
    mockDocumentElementSetProperty = jasmine.createSpy('setProperty');
    spyOnProperty(document.documentElement, 'style', 'get').and.returnValue({
      setProperty: mockDocumentElementSetProperty
    } as unknown as CSSStyleDeclaration);

    // Mock document.querySelector
    mockDocumentQuerySelector = spyOn(document, 'querySelector').and.callFake((selector: string) => {
      if (selector === '.dx-datagrid-headers') {
        return createMockHtmlElement({ offsetHeight: 50 });
      }
      return createMockHtmlElement();
    });

    await TestBed.configureTestingModule({
      declarations: [TableComponent, TableOutlineStubComponent],
      imports: [DxDataGridModule, FormsModule, DxButtonModule, SharedModule],
      providers: [
        { provide: ChangeDetectorRef, useValue: mockCdr },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;

    // Manually assign mocks for @ViewChild
    component.dataGrid = { instance: mockDataGridInstance } as unknown as DxDataGridComponent;
    component.columnChooserButton = new MockElementRef() as ElementRef;
    component.exportButton = new MockElementRef() as ElementRef;
    component.columnChooserDropdown = new MockElementRef() as ElementRef;
    component.exportOptionsDropdown = new MockElementRef() as ElementRef;

    // Provide deep copies of sample data to avoid modification across tests
    component.headers = JSON.parse(JSON.stringify(sampleHeaders));
    component.data = JSON.parse(JSON.stringify(sampleData));
    component.exportFileName = 'DefaultExport';
    component.entityType = 'Record';

    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1024);
    spyOnProperty(window, 'scrollY', 'get').and.returnValue(0);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Lifecycle Hooks & Initialization', () => {
    it('ngOnInit: should set isMobile based on window.innerWidth (desktop)', () => {
      (Object.getOwnPropertyDescriptor(window, 'innerWidth')?.get as jasmine.Spy).and.returnValue(1024);
      component.ngOnInit();
      expect(component.isMobile).toBeFalse();
    });

    it('ngOnInit: should set isMobile based on window.innerWidth (mobile)', () => {
      (Object.getOwnPropertyDescriptor(window, 'innerWidth')?.get as jasmine.Spy).and.returnValue(500);
      component.ngOnInit();
      expect(component.isMobile).toBeTrue();
    });

    it('ngOnInit: should add "id" to data items if missing and reset selection', () => {
      const dataWithoutIds = [{ name: 'Test' }];
      component.data = dataWithoutIds;
      component.selectedRowKeys = ['oldKey'];
      component.ngOnInit();
      expect(component.data[0].id).toBe('row-1');
      expect(component.selectedRowKeys).toEqual([]);
    });

    it('ngOnInit: should initialize cardFields for mobile view from visible headers', () => {
      component.headers = [
        { dataField: 'f1', caption: 'F1', visible: true },
        { dataField: 'f2', caption: 'F2', visible: false },
        { dataField: 'f3', caption: 'F3', visible: true },
        { dataField: 'f4', caption: 'F4', visible: true },
        { dataField: 'f5', caption: 'F5', visible: true },
      ];
      component.ngOnInit();
      expect(component.cardFields).toEqual(['f1', 'f3', 'f4']);
    });

    it('constructor: should initialize headers with defaults', () => {
      const initialHeaders: GridColumn[] = [{ dataField: 'test', caption: 'Test Col' }];
      component.headers = initialHeaders;
      component['initializeHeaders']();
      expect(component.headers[0].headerCellTemplate).toBe('headerCellTemplate');
      expect(component.headers[0].visible).toBeTrue();
      expect(component.headers[0].allowSorting).toBeTrue();
    });

    it('ngAfterViewInit: should initialize columnVisibility', () => {
      component.ngOnInit();
      component.ngAfterViewInit();
      expect(component.columnVisibility['id']).toBeTrue();
      expect(component.columnVisibility['name']).toBeTrue();
      expect(component.columnVisibility['email']).toBeTrue();
      expect(component.columnVisibility['company']).toBeFalse();
    });

    it('ngAfterViewInit: should NOT call configureDataGrid on mobile', () => {
      spyOn<any>(component, 'configureDataGrid');
      component.isMobile = true;
      component.ngAfterViewInit();
      expect(component['configureDataGrid']).not.toHaveBeenCalled();
    });
  });

  describe('Getters', () => {
    it('modalHeading should return correct string', () => {
      component.entityType = 'Customer';
      expect(component.modalHeading).toBe('Customer Details');
    });
    it('searchPlaceholder should return correct string', () => {
      component.entityType = 'Product';
      expect(component.searchPlaceholder).toBe('Search products...');
    });
  });

  describe('Mobile View Functionality', () => {
    beforeEach(() => {
      (Object.getOwnPropertyDescriptor(window, 'innerWidth')?.get as jasmine.Spy).and.returnValue(500);
      component.ngOnInit();
      component.ngAfterViewInit();
      component.mobilePageSize = 2;
      component.updatePagination();
    });

    it('checkIfMobile: should update isMobile and reset selection on view change', () => {
      component.isMobile = false;
      component.selectedRowKeys = ['1'];
      spyOn(component.onSelectionChanged, 'emit');

      (Object.getOwnPropertyDescriptor(window, 'innerWidth')?.get as jasmine.Spy).and.returnValue(500);
      component['checkIfMobile']();

      expect(component.isMobile).toBeTrue();
      expect(component.selectedRowKeys).toEqual([]);
      expect(component.onSelectionChanged.emit).toHaveBeenCalled();
      (Object.getOwnPropertyDescriptor(window, 'innerWidth')?.get as jasmine.Spy).and.returnValue(1024);
    });

    it('filteredData: should filter data based on searchQuery and visible columns', () => {
      component.searchQuery = 'alice';
      component.columnVisibility['name'] = true;
      expect(component.filteredData.length).toBe(1);
      expect(component.filteredData[0].name).toBe('Alice Wonderland');

      component.searchQuery = 'nonexistent';
      expect(component.filteredData.length).toBe(0);

      component.searchQuery = 'tech';
      component.columnVisibility['company'] = true;
      component.columnVisibility['name'] = false;
      expect(component.filteredData.length).toBe(1);
    });

    it('Pagination (Mobile): should paginate correctly', () => {
      expect(component.totalPages).toBe(2);
      expect(component.paginatedData.length).toBe(2);
      expect(component.paginatedData[0].id).toBe('1');

      component.goToNextPage();
      expect(component.currentPage).toBe(2);
      expect(component.paginatedData.length).toBe(1);
      expect(component.paginatedData[0].id).toBe('3');

      component.goToNextPage();
      expect(component.currentPage).toBe(2);

      component.goToPreviousPage();
      expect(component.currentPage).toBe(1);

      component.goToPreviousPage();
      expect(component.currentPage).toBe(1);
    });

    it('getSortIndicator: should return correct symbols', () => {
      component.sortField = 'name';
      component.sortDirection = 'asc';
      expect(component.getSortIndicator('name')).toBe('↑');
      component.sortDirection = 'desc';
      expect(component.getSortIndicator('name')).toBe('↓');
      expect(component.getSortIndicator('email')).toBe('');
    });

    it('Mobile Selection: toggleSelection should add/remove key and emit', () => {
      spyOn(component.onSelectionChanged, 'emit');
      component.toggleSelection('1');
      expect(component.selectedRowKeys).toContain('1');
      expect(component.onSelectionChanged.emit).toHaveBeenCalledWith(jasmine.objectContaining({ selectedRowKeys: ['1'] }));

      component.toggleSelection('1');
      expect(component.selectedRowKeys).not.toContain('1');
      expect(component.onSelectionChanged.emit).toHaveBeenCalledTimes(2);
    });

    it('Mobile Selection: toggleSelectAllOnPage should select/deselect all on current page', () => {
      component.paginatedData = [sampleData[0], sampleData[1]];
      component.toggleSelectAllOnPage();
      expect(component.selectedRowKeys).toContain('1');
      expect(component.selectedRowKeys).toContain('2');

      component.toggleSelectAllOnPage();
      expect(component.selectedRowKeys).toEqual([]);
    });

    it('Mobile Popups: toggleColumnChooserMobile, toggleMobileExportOptions', () => {
      component.toggleColumnChooserMobile();
      expect(component.showColumnChooserMobile).toBeTrue();
      component.toggleColumnChooserMobile();
      expect(component.showColumnChooserMobile).toBeFalse();

      component.toggleMobileExportOptions();
      expect(component.showMobileExportOptions).toBeTrue();
    });
  });

  describe('Desktop View Functionality (Column Chooser, Sorting, Selection)', () => {
    beforeEach(() => {
      component.isMobile = false;
      component.ngOnInit();
      component.ngAfterViewInit();
    });

    it('toggleColumnChooser: should toggle visibility and position dropdown', fakeAsync(() => {
      const event = new MouseEvent('click');
      spyOn(event, 'stopPropagation');
      spyOn<any>(component, 'positionDropdown');
      
      component.toggleColumnChooser(event);
      expect(component.showCustomColumnChooser).toBeTrue();
      expect(component.showExportModal).toBeFalse();
      expect(event.stopPropagation).toHaveBeenCalled();
      tick(0); // Resolve setTimeout
      expect(component['positionDropdown']).toHaveBeenCalledWith(component.columnChooserButton, component.columnChooserDropdown);
      
      component.toggleColumnChooser(event);
      expect(component.showCustomColumnChooser).toBeFalse();
      tick(0); // Ensure no pending timers
    }));

    it('onExportButtonClick: should toggle export modal and position dropdown', fakeAsync(() => {
      const event = new MouseEvent('click');
      spyOn(event, 'stopPropagation');
      spyOn<any>(component, 'positionDropdown');

      component.onExportButtonClick(event);
      expect(component.showExportModal).toBeTrue();
      expect(component.showCustomColumnChooser).toBeFalse();
      tick(0); // Resolve setTimeout
      expect(component['positionDropdown']).toHaveBeenCalledWith(component.exportButton, component.exportOptionsDropdown);
    }));

    it('Desktop Selection: handleSelectionChanged should update selectedRowKeys and emit', () => {
      spyOn(component.onSelectionChanged, 'emit');
      const dxEvent = { selectedRowKeys: [1, '2', {obj: 'data'}] };
      component.handleSelectionChanged(dxEvent);

      expect(component.selectedRowKeys).toEqual(['1', '2', '[object Object]']);
      expect(component.onSelectionChanged.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({ selectedRowKeys: ['1', '2', '[object Object]'] })
      );
    });
  });

  describe('Dropdown Closing Logic & Event Handlers', () => {
    it('onDocumentClick: should NOT close dropdowns if clickedInsideDropdown is true', () => {
      component.showCustomColumnChooser = true;
      component.clickedInsideDropdown = true;
      const mockEvent = new MouseEvent('click');
      component.onDocumentClick(mockEvent);
      expect(component.showCustomColumnChooser).toBeTrue();
      expect(component.clickedInsideDropdown).toBeFalse();
    });

  });

  describe('Owner Utilities', () => {
    it('getOwnerColor: should return a color from the predefined list', () => {
      const color = component.getOwnerColor('Unique Owner Name');
      expect(component.ownerColors).toContain(color);
    });

    it('getOwnerColor: should return the first color for null/undefined/empty owner', () => {
      expect(component.getOwnerColor('')).toBe(component.ownerColors[0]);
      expect(component.getOwnerColor(null as any)).toBe(component.ownerColors[0]);
    });

    it('getOwnerInitial: should return capitalized first letter', () => {
      expect(component.getOwnerInitial('john doe')).toBe('J');
      expect(component.getOwnerInitial('')).toBe('');
      expect(component.getOwnerInitial(undefined as any)).toBe('');
    });
  });

  describe('Helper Display Utilities', () => {
    it('getDisplayValue: should return value or fallback', () => {
      const item = { name: 'Test', emptyField: null };
      expect(component.getDisplayValue(item, 'name')).toBe('Test');
      expect(component.getDisplayValue(item, 'emptyField')).toBe('No empty field');
      expect(component.getDisplayValue(item, 'nonExistentField')).toBe('No non existent field');
    });

    it('getSortIcon & getSortIconClass (Desktop sorting icons)', () => {
      const col: GridColumn = { dataField: 'test', caption: 'Test' };
      expect(component.getSortIcon(col)).toBe('↕');
      expect(component.getSortIconClass(col)).toBe('sort-icon');

      col.sortOrder = 'asc';
      expect(component.getSortIcon(col)).toBe('↑');
      expect(component.getSortIconClass(col)).toBe('sort-icon active');

      col.sortOrder = 'desc';
      expect(component.getSortIcon(col)).toBe('↓');
      expect(component.getSortIconClass(col)).toBe('sort-icon active');
    });
  });

  describe('positionDropdown private method', () => {
    it('should attempt to set style properties on the dropdown', () => {
      const mockButtonRef = new MockElementRef();
      const mockDropdownRef = new MockElementRef();
      (mockButtonRef.nativeElement.getBoundingClientRect as jasmine.Spy).and.returnValue({
        left: 100, bottom: 150, right: 200, top: 120, width: 100, height: 30
      });
      mockDropdownRef.nativeElement.offsetWidth = 500;
      (Object.getOwnPropertyDescriptor(window, 'innerWidth')?.get as jasmine.Spy).and.returnValue(500);

      component['positionDropdown'](mockButtonRef, mockDropdownRef);

      expect(mockDropdownRef.nativeElement.style.position).toBe('absolute');
      expect(mockDropdownRef.nativeElement.style.left).toBe('0px');
      expect(mockDropdownRef.nativeElement.style.top).toBe('155px');
    });

    it('should do nothing if buttonRef or dropdownRef is missing', () => {
      const mockDropdownRef = new MockElementRef();
      component['positionDropdown'](null as any, mockDropdownRef);
      expect(mockDropdownRef.nativeElement.style.position).toBeUndefined();
    });
  });

  describe('configureDataGrid private method', () => {
    it('should correctly configure DxDataGrid options', () => {
      component.isMobile = false;
      component.headers = [
        { dataField: 'id', caption: 'ID', visible: true },
        { dataField: 'name', caption: 'Name', visible: true }
      ];
      component['configureDataGrid']();

      expect(mockDataGridInstance.option).toHaveBeenCalledWith('columnResizingMode', 'widget');
      component.headers.forEach(header => {
        expect(mockDataGridInstance.columnOption).toHaveBeenCalledWith(header.dataField, 'minWidth', 150);
      });
      expect(mockDataGridInstance.columnOption).toHaveBeenCalledWith('id', 'fixed', true);
      expect(mockDataGridInstance.columnOption).toHaveBeenCalledWith('id', 'fixedPosition', 'left');
      expect(mockDataGridInstance.option).toHaveBeenCalledWith('scrolling', jasmine.objectContaining({
        mode: 'standard', showScrollbar: 'always', useNative: true
      }));
      expect(mockDataGridInstance.option).toHaveBeenCalledWith('width', '100%');
      expect(mockDataGridInstance.refresh).toHaveBeenCalled();
    });

    it('should not try to fix a column if headers are empty', () => {
      component.isMobile = false;
      component.headers = [];
      component['configureDataGrid']();
      expect(mockDataGridInstance.columnOption).not.toHaveBeenCalledWith(undefined, 'fixed', true);
    });
  });
});