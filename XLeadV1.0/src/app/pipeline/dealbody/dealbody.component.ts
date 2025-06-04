import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dealbody',
  templateUrl: './dealbody.component.html',
  styleUrls: ['./dealbody.component.css']
})
export class DealbodyComponent {
   @Input() deals: any[] = []; // Array of deals to be displayed in the deal body
  @Input() stageName: string = ''; // Name of the stage for the deal body
  @Input() connectedTo: string[] = []; // Array of stage names to connect with for drag-and-drop functionality
  @Output() dealDropped = new EventEmitter<any>(); // Event emitter to notify when a deal is moved
  @Output() onEdit = new EventEmitter<any>(); // New: Forward edit event

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

