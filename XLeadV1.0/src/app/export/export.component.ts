import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent {
  @Input() iconName: string = '';
  @Input() buttonText: string = '';
  @Output() click = new EventEmitter<void>();
}