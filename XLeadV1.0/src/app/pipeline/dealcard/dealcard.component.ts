import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PipelineDeal } from '../pipelinepage/pipelinepage.component';
 
@Component({
  selector: 'app-dealcard',
  templateUrl: './dealcard.component.html',
  styleUrls: ['./dealcard.component.css']
})
export class DealcardComponent {
  @Input() deal: any;
  @Input() stageName: string = ''; 
  @Output() onEdit = new EventEmitter<any>();
  hover = false;
 
  constructor(private router: Router) {}
 
  onCardClick() {
    console.log('=== DEAL CARD CLICK ===');
    console.log('Deal:', this.deal);
    console.log('Stage Name from parent:', this.stageName);
    console.log('Original Data:', this.deal.originalData);
    console.log('Stage from originalData:', this.deal.originalData?.stageName);
    const dealDataForNavigation = {
      ...(this.deal.originalData || {}),
      id: this.deal.id,
      dealName: this.deal.title,
      dealAmount: this.deal.amount,
      stageName: this.deal.originalData?.stageName || this.stageName,
      closingDate: this.deal.originalData?.closingDate,
      startingDate: this.deal.originalData?.startingDate,
      customerName: this.deal.customerName || this.deal.originalData?.customerName,
      contactName: this.deal.contactName || this.deal.originalData?.contactName,
      salespersonName: this.deal.salesperson || this.deal.originalData?.salespersonName,
      description: this.deal.description || this.deal.originalData?.description,
      probability: this.deal.originalData?.probability || parseFloat(this.deal.probability?.replace('%', '')),
      regionName: this.deal.region || this.deal.originalData?.regionName,
      domainName: this.deal.domain || this.deal.originalData?.domainName,
      duName: this.deal.department || this.deal.originalData?.duName,
      countryName: this.deal.country || this.deal.originalData?.countryName,
      revenueTypeName: this.deal.revenueType || this.deal.originalData?.revenueTypeName,
      accountName: this.deal.account || this.deal.originalData?.accountName,
    };
   
    console.log('Navigation data prepared:', dealDataForNavigation);
    console.log('Stage being passed:', dealDataForNavigation.stageName);
    console.log('======================');
   
    this.router.navigate(['/dealinfo'], {
      state: {
        deal: dealDataForNavigation
      }
    });
  }
 
  onEditClick(event: Event) {
    event.stopPropagation();
    this.onEdit.emit(this.deal);
  }
}
 