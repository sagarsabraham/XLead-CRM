import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseService } from 'src/app/services/apiresponse.service';
import { ApiResponse } from '../models/api-response.model';

export interface Attachment {
  id: number;
  fileName: string;
  s3UploadName: string;
  dealId: number;
  createdBy: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiResponseService: ApiResponseService
  ) { }

  getAttachments(dealId: number): Observable<Attachment[]> {

    const source$: Observable<ApiResponse<Attachment[]>> =
      this.http.get<ApiResponse<Attachment[]>>(`${this.apiUrl}/api/attachments/deal/${dealId}`);
    return this.apiResponseService.handleResponse(source$);
  }
  uploadAttachment(file: File, dealId: number): Observable<Attachment> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('dealId', dealId.toString());

    const source$: Observable<ApiResponse<Attachment>> =
      this.http.post<ApiResponse<Attachment>>(`${this.apiUrl}/api/attachments/upload`, formData);
    return this.apiResponseService.handleResponse(source$);
  }
}