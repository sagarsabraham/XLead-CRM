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
    title: '',
    amount: 0, 
    date: null as Date | null, 
    boName: '',
    department: '',
    probability: '',
    region: '',
    stage: ''
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

    
    const dealData = {
      title: this.newDeal.title,
      amount: formattedAmount,
      date: formattedDate,
      boName: this.newDeal.boName,
      department: this.newDeal.department,
      probability: this.newDeal.probability,
      region: this.newDeal.region,
      stage: this.newDeal.stage
    };

    this.onSubmit.emit(dealData);
    this.resetForm();
  }

  resetForm() {
    this.newDeal = {
      title: '',
      amount: 0,
      date: null,
      boName: '',
      department: '',
      probability: '',
      region: '',
      stage: ''
    };
  }
}
