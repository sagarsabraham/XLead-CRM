import { Component, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, IconComponent, NgFor, SidenavComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() icons: string[] = [];
  @Input() name: string = '';
  @Input() role: string = '';
  @Input() navItems: { iconPath: string; text: string; route: string; isActive: boolean }[] = [];
  @Input() profile: { name: string; role: string } = { name: '', role: '' };

  isSidebarOpen = false;

  get initials(): string {
    if (!this.name) return '';
    const nameParts = this.name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
