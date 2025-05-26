import { Component, Input, Output, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() icons: string[] = [];
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

    navigate(route: string) {
    this.router.navigate([route]);
  }
}