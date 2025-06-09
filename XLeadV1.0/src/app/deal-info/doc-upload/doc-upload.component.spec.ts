import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { DocUploadComponent } from './doc-upload.component';
import { DocumentService, Attachment } from 'src/app/services/document.service';
import { DxFileUploaderModule, DxLoadPanelModule, DxListModule } from 'devextreme-angular';


const notifySpy = jasmine.createSpy('notify');


(window as any).notify = notifySpy;
import * as notifyModule from 'devextreme/ui/notify';
spyOn(notifyModule, 'default').and.callFake(notifySpy);


describe('DocUploadComponent', () => {
  let component: DocUploadComponent;
  let fixture: ComponentFixture<DocUploadComponent>;
  let documentServiceSpy: jasmine.SpyObj<DocumentService>;

  const mockAttachments: Attachment[] = [
    { id: 1, fileName: 'test-file-1.pdf', s3UploadName: '1.pdf', dealId: 123, createdBy: 1, createdAt: new Date() },
    { id: 2, fileName: 'report.docx', s3UploadName: '2.docx', dealId: 123, createdBy: 1, createdAt: new Date()},
  ];

  beforeEach(async () => {
    notifySpy.calls.reset();

    // Create a spy object for the DocumentService
    const docServiceSpyObj = jasmine.createSpyObj('DocumentService', ['getAttachments', 'uploadAttachment']);

    await TestBed.configureTestingModule({
      declarations: [DocUploadComponent],
      imports: [
        HttpClientTestingModule,
        DxFileUploaderModule,
        DxLoadPanelModule,
        DxListModule,
      ],
      providers: [
        { provide: DocumentService, useValue: docServiceSpyObj }
      ]
    }).compileComponents();

    documentServiceSpy = TestBed.inject(DocumentService) as jasmine.SpyObj<DocumentService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocUploadComponent);
    component = fixture.componentInstance;
    component.dealId = 123; // Provide a default dealId
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization (ngOnInit)', () => {
    it('should call loadAttachments if dealId is provided', () => {
      // Arrange
      const loadAttachmentsSpy = spyOn(component, 'loadAttachments').and.callThrough();
      documentServiceSpy.getAttachments.and.returnValue(of([]));

      // Act
      fixture.detectChanges();

      // Assert
      expect(loadAttachmentsSpy).toHaveBeenCalled();
    });

    it('should NOT call loadAttachments if dealId is not provided', () => {
      // Arrange
      component.dealId = undefined as any;
      const loadAttachmentsSpy = spyOn(component, 'loadAttachments');
      const consoleErrorSpy = spyOn(console, 'error');

      // Act
      fixture.detectChanges();

      // Assert
      expect(loadAttachmentsSpy).not.toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith("DealId is required for the doc-upload component.");
    });
  });

  describe('loadAttachments', () => {
    it('should set isLoading to false and populate attachments on successful API call', fakeAsync(() => {
      // Arrange
      documentServiceSpy.getAttachments.and.returnValue(of(mockAttachments));

      // Act
      component.loadAttachments();
      tick();

      // Assert
      expect(component.attachments.length).toBe(2);
      expect(component.isLoading).toBe(false);
    }));

    it('should set isLoading to false and handle API errors gracefully', fakeAsync(() => {
      // Arrange
      const errorResponse = new Error('Failed to fetch');
      documentServiceSpy.getAttachments.and.returnValue(throwError(() => errorResponse));
      const consoleErrorSpy = spyOn(console, 'error');

      // Act
      component.loadAttachments();
      tick();

      // Assert
      expect(component.attachments.length).toBe(0);
      expect(component.isLoading).toBe(false);
      expect(notifySpy).toHaveBeenCalledWith('Failed to load documents.', 'error', 3000);
      expect(consoleErrorSpy).toHaveBeenCalledWith(errorResponse);
    }));
  });

  describe('File Upload', () => {
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    // IMPORTANT: Create a fresh spy for the reset method in each test where it's used.
    const mockUploaderInstance = { reset: () => {} };

    it('onFileSelected should call uploadFile with the first file', () => {
      const uploadFileSpy = spyOn(component, 'uploadFile');
      const event = { value: [mockFile], component: mockUploaderInstance };
      component.onFileSelected(event);
      expect(uploadFileSpy).toHaveBeenCalledWith(mockFile, mockUploaderInstance);
    });

    it('onFileSelected should do nothing if no files are provided', () => {
      const uploadFileSpy = spyOn(component, 'uploadFile');
      const event = { value: [], component: mockUploaderInstance };
      component.onFileSelected(event);
      expect(uploadFileSpy).not.toHaveBeenCalled();
    });

    it('uploadFile should add new document and reset uploader on success', fakeAsync(() => {
      // Arrange
      const newAttachment: Attachment = { id: 3, fileName: 'test.png', s3UploadName: '3.png', dealId: 123, createdBy: 1, createdAt: new Date()};
      documentServiceSpy.uploadAttachment.and.returnValue(of(newAttachment));
      const uploaderInstanceWithSpy = { reset: jasmine.createSpy('reset') };
      component.attachments = [...mockAttachments];

      // Act
      component.uploadFile(mockFile, uploaderInstanceWithSpy);
      tick();

      // Assert
      expect(component.attachments.length).toBe(3);
      expect(component.attachments[0]).toEqual(newAttachment);
      expect(notifySpy).toHaveBeenCalledWith(`'${mockFile.name}' uploaded successfully.`, 'success', 3000);
      expect(uploaderInstanceWithSpy.reset).toHaveBeenCalled();
    }));

    it('uploadFile should handle errors gracefully', fakeAsync(() => {
      // Arrange
      const errorResponse = new Error('Upload failed');
      documentServiceSpy.uploadAttachment.and.returnValue(throwError(() => errorResponse));
      const consoleErrorSpy = spyOn(console, 'error');
      const uploaderInstanceWithSpy = { reset: jasmine.createSpy('reset') };
      component.attachments = [...mockAttachments];
      const initialCount = component.attachments.length;

      // Act
      component.uploadFile(mockFile, uploaderInstanceWithSpy);
      tick();

      // Assert
      expect(component.attachments.length).toBe(initialCount);
      expect(notifySpy).toHaveBeenCalledWith(`Error uploading '${mockFile.name}'.`, 'error', 3000);
      expect(consoleErrorSpy).toHaveBeenCalledWith(errorResponse);
      expect(uploaderInstanceWithSpy.reset).not.toHaveBeenCalled();
    }));
  });
});