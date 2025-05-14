import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-deal-modal',
  templateUrl: './add-deal-modal.component.html',
  styleUrls: ['./add-deal-modal.component.css']
})
export class AddDealModalComponent {
  @Input() isVisible: boolean = false;
  @Input() stages: string[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  newDeal = {
    salesperson: '',
    amount: 0,
    companyName: '',
    title: '',
    account: '',
    region: '',
    contactName: '',
    domain: '',
    stage: '',
    revenueType: '',
    department: '',
    country: '',
    date: null as Date | null,
    description: '',
    // doc: null as File[] | null, // Updated to handle file upload
    probability: ''
  };

  handleClose() {
    this.onClose.emit();
    this.resetForm();
  }

  handleSubmit() {
    const formattedAmount = `$ ${this.newDeal.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

    let formattedDate = '';
    if (this.newDeal.date) {
      formattedDate = this.newDeal.date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }

    // // Handle the uploaded doc (store file name if a file is uploaded)
    // const documentName = this.newDeal.doc && this.newDeal.doc.length > 0
    //   ? this.newDeal.doc[0].name
    //   : '';

    // Create the deal object with formatted values
    const dealData = {
      salesperson: this.newDeal.salesperson,
      amount: formattedAmount,
      companyName: this.newDeal.companyName,
      title: this.newDeal.title,
      account: this.newDeal.account,
      region: this.newDeal.region,
      contactName: this.newDeal.contactName,
      domain: this.newDeal.domain,
      stage: this.newDeal.stage,
      revenueType: this.newDeal.revenueType,
      department: this.newDeal.department,
      country: this.newDeal.country,
      date: formattedDate,
      description: this.newDeal.description,
      // doc: documentName, // Store the file name
      probability: this.newDeal.probability
    };

    this.onSubmit.emit(dealData);
    this.resetForm();
  }

  resetForm() {
    this.newDeal = {
      salesperson: '',
      amount: 0,
      companyName: '',
      title: '',
      account: '',
      region: '',
      contactName: '',
      domain: '',
      stage: '',
      revenueType: '',
      department: '',
      country: '',
      date: null,
      description: '',
      // doc: null, // Reset doc field
      probability: ''
    };
  }
}
