import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Optional: define interfaces or import DTOs if available
export interface AttachmentCreateDto {
  fileName: string;
  s3UploadName: string;
  dealId: number;
  createdBy: number;
}

export interface AttachmentReadDto {
  fileName: string;
  s3UploadName: string;
  dealId: number;
  createdBy: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/api/attachment`;

  constructor(private http: HttpClient) {}

  saveAttachmentMetadata(data: AttachmentCreateDto): Observable<AttachmentReadDto> {
    const url = this.apiUrl;
    console.log('Posting attachment metadata to:', url);
    return this.http.post<AttachmentReadDto>(url, data);
  }

  handleUploadResponse(response: any): void {
    console.log('File uploaded successfully:', response);
    // Extend this method to show toast/snackbar, refresh UI, etc.
  }

  handleUploadError(error: any): void {
    console.error('File upload failed:', error);
    // Extend this method to show error message or retry option
  }
}
