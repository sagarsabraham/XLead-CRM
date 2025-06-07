import { Component, Input, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.css']
})
export class DocUploadComponent implements OnInit {
  @Input() dealId: string | null = null;
  uploadUrl: string = '';
  constructor(private uploadService: DocumentService, private authService: AuthServiceService) {}

  ngOnInit(): void {
    if (this.dealId) {
      this.uploadUrl = `/api/upload/deal/${this.dealId}`;
    }
  }

  onUploaded(event: any): void {
  const response = JSON.parse(event.request.response);
  const fileName = response.fileName;
  const storedAs = response.storedAs;

  const attachment = {
    fileName: fileName,
    s3UploadName: storedAs,
    dealId: this.dealId ? Number(this.dealId) : 0,
    createdBy: this.authService.getUserId()
  };

  this.uploadService.saveAttachmentMetadata(attachment).subscribe(() => {
    console.log('File metadata saved to DB');
  });
}


  onUploadError(event: any): void {
    const error = event.error;
    this.uploadService.handleUploadError(error);
  }
}