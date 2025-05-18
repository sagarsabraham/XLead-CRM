import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() icons: string[] = [];
  @Output() toggleDrawer = new EventEmitter<void>();
  logoPath = 'assets/logo.png';

  navItems = [
    {
      iconPath: 'assets/Dashboard.png',
      text: 'Dashboard',
      route: '/dashboard',
      isActive: false,
    },
    {
      iconPath: 'assets/Pipeline.png',
      text: 'Pipeline',
      route: '/pipeline',
      isActive: false,
    },
    {
      iconPath: 'assets/Contact.png',
      text: 'Contacts',
      route: '/contacts',
      isActive: false,
    },
    {
      iconPath: 'assets/Company.png',
      text: 'Companies',
      route: '/companies',
      isActive: false,
    },
  ];

  profile = {
    name: 'Subash Joseph',
    role: 'Admin',
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.navItems = this.navItems.map(item => ({
        ...item,
        isActive: event.urlAfterRedirects === item.route,
      }));
    });
  }

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


    navigate(route: string) {
    this.router.navigate([route]);
  }
}