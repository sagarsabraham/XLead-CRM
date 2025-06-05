import { Component, Input, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.css']
})
export class DocUploadComponent implements OnInit {
  @Input() dealId: string | null = null;
  uploadUrl: string = '';

  constructor(private uploadService: DocumentService) {}

  ngOnInit(): void {
    if (this.dealId) {
      this.uploadUrl = `/api/upload/deal/${this.dealId}`;
    }
  }

  onUploaded(event: any): void {
    const response = event.request.response;
    this.uploadService.handleUploadResponse(response);
  }

  onUploadError(event: any): void {
    const error = event.error;
    this.uploadService.handleUploadError(error);
  }
}