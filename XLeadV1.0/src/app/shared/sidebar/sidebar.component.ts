import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import{ PrivilegeServiceService } from 'src/app/services/privilege-service.service';

interface NavItem {
  iconPath: string;
  text: string;
  route: string;
  isActive: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  logoPath = 'assets/logo.png';
  isMobileMenuOpen = false;
  isMobileView = false;
  private routerSubscription: Subscription | null = null;
  navItems: NavItem[] = [];

  constructor(
    private router: Router, 
    private auth: AuthServiceService,
    private privilegeService: PrivilegeServiceService
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
   
    this.privilegeService.getPrivileges(this.auth.userId).subscribe(privs => {
      this.auth.setPrivileges(privs);
      this.initializeNavItems();
    });
  }

  private initializeNavItems() {
    const pipelineRoute = this.getPipelineRoute();
    console.log('Pipeline route:', pipelineRoute);
    
    this.navItems = [
      {
        iconPath: 'assets/Dashboard.png',
        text: 'Dashboard',
        route: '/dashboard',
        isActive: false,
      },
      {
        iconPath: 'assets/Pipeline.png',
        text: 'Pipeline',
        route: pipelineRoute,
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

    this.updateActiveRoute(this.router.url);

    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveRoute(event.urlAfterRedirects);
    });

    this.checkScreenSize();
  }

  ngOnDestroy() {
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }

  updateActiveRoute(url: string) {
    const normalizedUrl = url === '/' ? '/dashboard' : url;
    this.navItems = this.navItems.map(item => ({
      ...item,
      isActive: normalizedUrl === item.route || normalizedUrl.startsWith(item.route + '/'),
    }));
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
 
  checkScreenSize() {
    const prevMobileView = this.isMobileView;
    this.isMobileView = window.innerWidth <= 768;
    if (prevMobileView && !this.isMobileView) {
      this.isMobileMenuOpen = false;
    }
  }
 
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }
 
  closeMobileMenuIfOpen() {
    if (this.isMobileView && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  getPipelineRoute(): string {
    console.log('Current privileges:', this.auth.privileges); // Debug line
    if (this.auth.hasPrivilege('overview')) {
      return '/overview';
    } else if (this.auth.hasPrivilege('PipelineDetailAccess')) {
      return '/pipeline';
    } else {
      return '/access-denied';
    }
  }
}