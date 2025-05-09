import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css'],
})
export class ExportComponent {
  @Input() iconName: string = '';
  @Input() buttonText: string = '';
  @Output() click = new EventEmitter<void>();
}