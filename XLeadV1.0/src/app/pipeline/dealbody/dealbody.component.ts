import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
 
@Component({
  selector: 'app-dealbody',
  templateUrl: './dealbody.component.html',
  styleUrls: ['./dealbody.component.css']
})
export class DealbodyComponent {
   @Input() deals: any[] = [];
  @Input() stageName: string = '';
  @Input() connectedTo: string[] = [];
  @Output() dealDropped = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
 
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
 
  onEditDeal(deal: any) {
    this.onEdit.emit(deal);
  }
}

