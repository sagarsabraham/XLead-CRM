
import { Component, OnInit } from '@angular/core';
import { CompanyContactService } from 'src/app/pipeline/company-contact.service';


@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {
  tableHeaders = [
    { dataField: 'name', caption: 'Name', visible: true },
    { dataField: 'phone', caption: 'Phone', visible: true },
    { dataField: 'email', caption: 'Email', visible: true },
    { dataField: 'company', caption: 'Company', visible: false },
    { dataField: 'status', caption: 'Status', visible: true }
  ];

  tableData: any[] = [];
  totalContacts = 0;
  isLoading = true;

  constructor(private companyContactService: CompanyContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.companyContactService.getContacts().subscribe({
      next: (data) => {
        this.tableData = data.map((contact: any) => ({
          id: contact.id,
          name: contact.fullName,
          company: contact.companyName,
          email: contact.email,
          phone: contact.phoneNumber,
          status: contact.isActive ? 'Active' : 'Not Active'
        }));
        
        this.totalContacts = this.tableData.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        this.isLoading = false;
      }
    });
  }
}