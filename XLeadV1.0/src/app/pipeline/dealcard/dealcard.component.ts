import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PipelineDeal } from '../pipelinepage/pipelinepage.component';
 
@Component({
  selector: 'app-dealcard',
  templateUrl: './dealcard.component.html',
  styleUrls: ['./dealcard.component.css']
})
export class DealcardComponent {
  @Input() deal!: PipelineDeal;
  @Output() onEdit = new EventEmitter<PipelineDeal>();
  hover = false;
 
  constructor(private router: Router) {}
 
  onCardClick() {
    const dealId = this.deal.title.replace(/\s+/g, '-').toLowerCase();
    this.router.navigate([`/dealinfo`], { state: { deal: this.deal } });
  }
 
  onEditClick(event: Event) {
    event.stopPropagation();
    this.onEdit.emit(this.deal);
  }
}
 