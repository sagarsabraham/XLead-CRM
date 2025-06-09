import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Match this interface with your .NET Attachment model
export interface Attachment {
  id: number;
  fileName: string;
  s3UploadName: string;
  dealId: number;
  createdBy: number;
  createdAt: string; // ISO date string
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAttachments(dealId: number): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(`${this.apiUrl}/attachments/deal/${dealId}`);
  }

  uploadAttachment(file: File, dealId: number): Observable<Attachment> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('dealId', dealId.toString());

    return this.http.post<Attachment>(`${this.apiUrl}/attachments/upload`, formData);
  }
}