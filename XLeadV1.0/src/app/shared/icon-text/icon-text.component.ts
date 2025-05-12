import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { CommonModule, NgClass } from '@angular/common';
import { DxListModule } from 'devextreme-angular';

@Component({
  selector: 'app-icon-text',
  templateUrl: './icon-text.component.html',
  styleUrls: ['./icon-text.component.css'],
  // standalone: true,
  // imports: [CommonModule, IconComponent, DxListModule, NgClass]
})
export class IconTextComponent {
  @Input() iconPath: string = '';
  @Input() text: string = '';
  @Input() isActive: boolean = false;
  @Input() routeTo: string = '';
  constructor(private router: Router) {}

  navigate() {
    this.router.navigate([this.routeTo]);
  }
}
