import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth-service.service';
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
    private auth: AuthService,
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
    console.log('Initializing nav items with privileges:', this.auth.privileges);
    
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
        route: this.getPipelineActualRoute(),
        isActive: false,
      },
      {
        iconPath: 'assets/Contact.png',
        text: 'Contacts',
        route: '/contacts',
        isActive: false,
      },
      {
        iconPath: 'assets/customer.png',
        text: 'Customers',
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
      isActive: this.isRouteActive(normalizedUrl, item.route),
    }));
  }

  private isRouteActive(currentUrl: string, itemRoute: string): boolean {
 
    if (itemRoute === '/access-denied') {
      return false;
    }
    
  
    if (currentUrl === itemRoute) {
      return true;
    }
    
    
    if (currentUrl.startsWith(itemRoute + '/')) {
      return true;
    }
    
    return false;
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
   
    if (route === '/contacts' && !this.hasContactsAccess()) {
      console.log('Access denied - insufficient privileges for contacts');
      this.router.navigate(['/access-denied']);
      return;
    }
    
    if (route === '/companies' && !this.hasCustomersAccess()) {
      console.log('Access denied - insufficient privileges for customers');
      this.router.navigate(['/access-denied']);
      return;
    }
    
    if ((route === '/pipeline' || route === '/overview') && !this.hasPipelineAccess()) {
      console.log('Access denied - insufficient privileges for pipeline');
      this.router.navigate(['/access-denied']);
      return;
    }

   
    this.router.navigate([route]);
  }

  getPipelineActualRoute(): string {
    console.log('Current privileges:', this.auth.privileges);
    if (this.auth.hasPrivilege('Overview')) {
      return '/overview';
    } else if (this.auth.hasPrivilege('PipelineDetailAccess')) {
      return '/pipeline';
    } else {
      return '/pipeline'; 
    }
  }

  hasPipelineAccess(): boolean {
    return this.auth.hasPrivilege('Overview') || this.auth.hasPrivilege('PipelineDetailAccess');
  }

  hasContactsAccess(): boolean {
    return this.auth.hasPrivilege('ViewContacts') ;
  }

  hasCustomersAccess(): boolean {
    return this.auth.hasPrivilege('ViewCustomers') ;
  }

 
  getPipelineRoute(): string {
    console.log('Current privileges:', this.auth.privileges);
    if (this.auth.hasPrivilege('Overview')) {
      return '/overview';
    } else if (this.auth.hasPrivilege('PipelineDetailAccess')) {
      return '/pipeline';
    } else {
      return '/access-denied';
    }
  }

  getContactsRoute(): string {
    console.log('Checking contacts privileges:', this.auth.privileges);
    if (this.auth.hasPrivilege('ViewContacts') ) {
      return '/contacts';
    } else {
      return '/access-denied';
    }
  }

  getCustomersRoute(): string {
    console.log('Checking customers privileges:', this.auth.privileges);
    if (this.auth.hasPrivilege('ViewCustomers') ) {
      return '/companies';
    } else {
      return '/access-denied';
    }
  }
}