import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.css']
})
export class DocUploadComponent implements OnInit {
  @Input() dealId: number = 0; // Input for dealId
  isDropZoneActive: boolean = false;
  selectedFile: File | null = null;
  uploadInProgress: boolean = false;
  uploadProgress: number = 0;
  allowedFileExtensions: string[] = ['.pdf', '.doc', '.docx', '.jpg', '.png'];
  errorMessage: string | null = null;
  uploadedFiles: any[] = [];
  private baseUrl = 'http://localhost:5001'; // Updated to backend URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.dealId) {
      this.loadUploadedFiles();
    }
  }

  // Load files for the given dealId
  loadUploadedFiles(): void {
    this.http.get(`${this.baseUrl}/api/attachments/deal/${this.dealId}`).subscribe({
      next: (files: any) => {
        this.uploadedFiles = files;
      },
      error: (err) => {
        this.errorMessage = 'Error loading files: ' + err.message;
      }
    });
  }

  // Handle drag-and-drop enter
  onDropZoneEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDropZoneActive = true;
  }

  // Handle drag-and-drop leave
  onDropZoneLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDropZoneActive = false;
  }

  // Handle file selection
  onFilesSelected(event: any): void {
    this.errorMessage = null;
    const files = event.value || event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.validateAndUploadFile(file);
    }
  }

  // Validate and upload file
  private validateAndUploadFile(file: File): void {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!extension || !this.allowedFileExtensions.includes(extension)) {
      this.errorMessage = `Invalid file type. Allowed types: ${this.allowedFileExtensions.join(', ')}`;
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
    this.uploadFile(file);
  }

  // Upload file to backend
  private uploadFile(file: File): void {
    this.uploadInProgress = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('dealId', this.dealId.toString());

    this.http.post(`${this.baseUrl}/api/attachments/upload`, formData).subscribe({
      next: (response: any) => {
        this.uploadProgress = 100;
        this.uploadInProgress = false;
        this.uploadedFiles.push({
          Id: response.Id,
          FileName: response.FileName,
          S3UploadName: `${response.Id}${this.getExtension(response.FileName)}`, // For download
          CreatedAt: new Date()
        });
        this.selectedFile = null;
      },
      error: (err) => {
        this.errorMessage = 'Error uploading file: ' + err.message;
        this.uploadInProgress = false;
        this.uploadProgress = 0;
      }
    });

    // Simulate progress
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
      }
    }, 500);
  }

  // Remove selected file (local preview only)
  removeFile(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.uploadInProgress = false;
    this.errorMessage = null;
  }

  // Delete file from backend
  deleteFile(file: any): void {
    this.http.delete(`${this.baseUrl}/api/attachments/${file.Id}`).subscribe({
      next: () => {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.Id !== file.Id);
      },
      error: (err) => {
        this.errorMessage = 'Error deleting file: ' + err.message;
      }
    });
  }

  // Download file
  downloadFile(file: any): void {
    const fileUrl = `${this.baseUrl}/api/attachments/download/${file.S3UploadName}`;
    window.open(fileUrl, '_blank');
  }

  // Get file icon class
  getFileIconClass(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'fas fa-file-image';
      default:
        return 'fas fa-file';
    }
  }

  // Get file extension
  private getExtension(fileName: string): string {
    return '.' + fileName.split('.').pop()?.toLowerCase();
  }

  // Format file size (not stored in DB, so unavailable for uploaded files)
  getFileSize(size: number): string {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
}