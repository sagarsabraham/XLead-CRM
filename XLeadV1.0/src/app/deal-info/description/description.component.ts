import { Component, EventEmitter, Input, Output } from '@angular/core';

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
    this.editedDescription = this.description;
  }

  saveDescription() {
    this.descriptionChange.emit(this.editedDescription);
    this.isEditing = false;
  }

  cancelEditing() {
    this.isEditing = false;
    this.editedDescription = this.description;
  }
}