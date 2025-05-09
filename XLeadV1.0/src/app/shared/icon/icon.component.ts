import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';

@Component({
  selector: 'app-icon',
  // standalone:true,
  // imports: [CommonModule, DxButtonModule],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent {
  @Input() iconPath: string = '';
}
