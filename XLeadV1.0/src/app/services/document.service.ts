import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Attachment {
  id: number;
  fileName: string;
  s3UploadName: string;
  dealId: number;
  createdBy: number;
  createdAt: Date;
  createdAt: Date;
}
 
@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;
 
  constructor(private http: HttpClient) { }
 
  getAttachments(dealId: number): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(`${this.apiUrl}/api/attachments/deal/${dealId}`);
    return this.http.get<Attachment[]>(`${this.apiUrl}/api/attachments/deal/${dealId}`);
  }
 
  uploadAttachment(file: File, dealId: number): Observable<Attachment> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('dealId', dealId.toString());

    return this.http.post<Attachment>(`${this.apiUrl}/api/attachments/upload`, formData);
  }
}
 