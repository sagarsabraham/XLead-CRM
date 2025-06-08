import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent {
  @Input() description: string = '';
  @Output() descriptionChange = new EventEmitter<string>();
  
  isEditing: boolean = false;
  editedDescription: string = '';

  startEditing() {
    this.isEditing = true;
    this.editedDescription = this.description || '';
  }

  saveDescription() {
    this.isEditing = false;
    this.description = this.editedDescription;
    this.descriptionChange.emit(this.editedDescription);
  }

  cancelEditing() {
    this.isEditing = false;
    this.editedDescription = this.description || '';
  }
}