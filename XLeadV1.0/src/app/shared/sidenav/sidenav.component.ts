import { Component, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { IconTextComponent } from '../icon-text/icon-text.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  // standalone: true,
  // imports: [CommonModule, RouterModule, NgFor, IconTextComponent, ProfileComponent],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Input() navItems: { iconPath: string; text: string; route: string; isActive: boolean }[] = [];
  @Input() profile: { name: string; role: string } = { name: '', role: '' };
}
