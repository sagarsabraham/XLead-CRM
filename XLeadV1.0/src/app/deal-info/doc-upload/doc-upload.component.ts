import { Component, Input, OnInit } from '@angular/core';
import { DocumentService, Attachment } from 'src/app/services/document.service';
import { lastValueFrom } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { environment } from 'src/environments/environment';
 
@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.css']
})
export class DocUploadComponent implements OnInit {
  @Input() dealId!: number;

  attachments: Attachment[] = [];
  isLoading = true;
  baseStaticUrl = `${environment.apiUrl}/UploadedFiles`;

  constructor(private documentService: DocumentService) { }
 
  ngOnInit(): void {
    if (!this.dealId) {
      console.error("DealId is required for the doc-upload component.");
      this.isLoading = false;
      return;
    }
    this.loadAttachments();
  }
 
  async loadAttachments(): Promise<void> {
    this.isLoading = true;
    try {
      this.attachments = await lastValueFrom(this.documentService.getAttachments(this.dealId));
    } catch (error) {
      notify('Failed to load documents.', 'error', 3000);
      notify('Failed to load documents.', 'error', 3000);
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
 
  onFileSelected(e: any): void {
    const files: File[] = e.value;
    if (files.length > 0) {
      this.uploadFile(files[0], e.component);
    }
  }
 
  async uploadFile(file: File, uploaderInstance: any): Promise<void> {
    try {
      const newDocument = await lastValueFrom(this.documentService.uploadAttachment(file, this.dealId));
      notify(`'${file.name}' uploaded successfully.`, 'success', 3000);

      this.attachments.unshift(newDocument);

      uploaderInstance.reset();
 
    } catch (error) {
      notify(`Error uploading '${file.name}'.`, 'error', 3000);
      console.error(error);
    }
  }
}
 