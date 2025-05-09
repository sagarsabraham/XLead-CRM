import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  // standalone: true,
  // imports: [CommonModule, IconTextComponent, NgFor, ProfileComponent, RouterModule, DxDrawerModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() icons: string[] = [];
  @Input() navItems: { iconPath: string; text: string; route: string; isActive: boolean }[] = [];
  @Input() profile: { name: string; role: string } = { name: '', role: '' };

  isSidebarOpen = false;

  get initials(): string {
    if (!this.profile.name) return '';
    const nameParts = this.profile.name.trim().split(' ');
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
