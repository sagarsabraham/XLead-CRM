import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DealcardComponent } from '../dealcard/dealcard.component';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dealbody',
  imports: [DealcardComponent, CommonModule, DragDropModule],
  templateUrl: './dealbody.component.html',
  styleUrl: './dealbody.component.css'
})
export class DealbodyComponent {
  @Input() deals: any[] = []; // Array of deals to be displayed in the deal body
  @Input() stageName: string = ''; // Name of the stage for the deal body
  @Input() connectedTo: string[] = []; // Array of stage names to connect with for drag-and-drop functionality
  @Output() dealDropped = new EventEmitter<any>(); // Event emitter to notify when a deal is moved

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
}