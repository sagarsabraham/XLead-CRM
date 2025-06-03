import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.css'],
})
export class DocUploadComponent {
  isDropZoneActive = false;
  selectedFile: File | null = null;
  uploadInProgress = false;
  uploadProgress = 0;
  errorMessage = '';
  allowedFileExtensions: string[] = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];

  constructor(private http: HttpClient) {}

  onDropZoneEnter({ component, dropZoneElement, event }: { component: any; dropZoneElement: HTMLElement; event: any }) {
    if (dropZoneElement.id === 'doc-dropzone') {
      const items = event.originalEvent.dataTransfer.items;
      const allowedFileExtensions = component.option('allowedFileExtensions');
      const draggedFileExtension = `.${items[0].type.split('/')[1]}`.toLowerCase();
      const isSingleFileDragged = items.length === 1;
      const isValidFileExtension = allowedFileExtensions.includes(draggedFileExtension);

      if (isSingleFileDragged && isValidFileExtension) {
        this.isDropZoneActive = true;
      }
    }
  }

  onDropZoneLeave({ dropZoneElement }: { dropZoneElement: HTMLElement }) {
    if (dropZoneElement.id === 'doc-dropzone') {
      this.isDropZoneActive = false;
    }
  }

  onFilesSelected({ value }: { value: File[] }) {
    if (value && value.length > 0) {
      this.selectedFile = value[0];
      this.uploadFileToS3(this.selectedFile);
    }
  }

  async uploadFileToS3(file: File) {
    try {
      this.uploadInProgress = true;
      this.uploadProgress = 0;
      this.errorMessage = '';

      // Request presigned URL from backend
      const presignedUrlResponse = await this.http
        .post<{ url: string; key: string }>('api/s3/presigned-url', {
          fileName: file.name,
          fileType: file.type,
        })
        .toPromise();

      if (!presignedUrlResponse) {
        throw new Error('Failed to get presigned URL from server.');
      }
      const { url, key } = presignedUrlResponse;

      // Upload file to S3 using presigned URL
      await this.http
        .put(url, file, {
          headers: { 'Content-Type': file.type },
          observe: 'events',
          reportProgress: true,
        })
        .subscribe({
          next: (event: any) => {
            if (event.type === 1) { // HttpEventType.UploadProgress
              this.uploadProgress = Math.round((event.loaded / event.total) * 100);
            } else if (event.type === 4) { // HttpEventType.Response
              this.uploadInProgress = false;
              this.uploadProgress = 100;
            }
          },
          error: (err) => {
            this.errorMessage = 'Upload failed. Please try again.';
            this.uploadInProgress = false;
            this.selectedFile = null;
          },
        });
    } catch (error) {
      this.errorMessage = 'Error initiating upload. Please try again.';
      this.uploadInProgress = false;
      this.selectedFile = null;
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.uploadInProgress = false;
    this.errorMessage = '';
  }

  getFileIconClass(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'dx-icon-pdf';
      case 'doc':
      case 'docx':
        return 'dx-icon-doc';
      case 'xls':
      case 'xlsx':
        return 'dx-icon-xls';
      default:
        return 'dx-icon-file';
    }
  }

  getFileSize(size: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    let i = 0;
    while (size >= 1024 && i < sizes.length - 1) {
      size /= 1024;
      i++;
    }
    return `${Math.round(size * 100) / 100} ${sizes[i]}`;
  }
}