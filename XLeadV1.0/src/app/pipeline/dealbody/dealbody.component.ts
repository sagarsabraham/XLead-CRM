import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PipelineDeal } from '../pipelinepage/pipelinepage.component';
 
@Component({
  selector: 'app-dealbody',
  templateUrl: './dealbody.component.html',
  styleUrls: ['./dealbody.component.css']
})
export class DealbodyComponent {
  @Input() deals: PipelineDeal[] = [];
  @Input() stageName: string = '';
  @Input() connectedTo: string[] = [];
  @Output() dealDropped = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<PipelineDeal>();
 
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      return;
    }
 
    this.dealDropped.emit({
      previousStage: event.previousContainer.id,
      currentStage: event.container.id,
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex
    });
  }
 
  onEditDeal(deal: PipelineDeal) {
    this.onEdit.emit(deal);
  }
}
 