import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  handleUploadResponse(response: any): void {
    console.log('File uploaded successfully:', response);
    // Add logic to handle successful upload
  }

  handleUploadError(error: any): void {
    console.error('File upload failed:', error);
    // Add logic to handle upload error
  }
}