import { Component, Input, Output, EventEmitter, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() icons: string[] = [];
  logoPath = 'assets/logo.png';
  isMobileMenuOpen = false;
  isMobileView = false;
  private routerSubscription: Subscription | null = null;

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

  constructor(private router: Router) {
    this.checkScreenSize();
  }

  ngOnInit() {
    // Set initial active route
    this.updateActiveRoute(this.router.url);
    
    // Subscribe to route changes
    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveRoute(event.urlAfterRedirects);
    });
    
    // Check screen size on init
    this.checkScreenSize();
  }
  
  ngOnDestroy() {
    // Clean up subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateActiveRoute(url: string) {
    this.navItems = this.navItems.map(item => ({
      ...item,
      isActive: url === item.route || url.startsWith(item.route + '/'),
    }));
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const prevMobileView = this.isMobileView;
    this.isMobileView = window.innerWidth <= 768;
    
    // Close mobile menu when transitioning from mobile to desktop
    if (prevMobileView && !this.isMobileView) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent scrolling on body when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenuIfOpen() {
    if (this.isMobileView && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
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