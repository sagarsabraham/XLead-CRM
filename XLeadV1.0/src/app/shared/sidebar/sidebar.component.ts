import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { PrivilegeServiceService, Privilege } from 'src/app/services/privilege-service.service'; 

interface NavItem {
  iconPath: string;
  text: string;
  route: string;
  isActive: boolean;
  disabled?: boolean;
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
    
    this.privilegeService.getPrivileges(this.auth.userId).subscribe((privs: Privilege[]) => {
      this.auth.setPrivileges(privs); 
      console.log('Privileges fetched and set in AuthService:', this.auth.privileges);
      this.initializeNavItems(); 
      this.setupRouterListener(); 
    }, error => {
      console.error("Error fetching privileges:", error);
     
      this.auth.setPrivileges([]); 
      this.initializeNavItems(); 
      this.setupRouterListener();
    });
  }

  private initializeNavItems() {
    const pipelineRoute = this.getPipelineRoute();
    const contactsRoute = this.getContactsRoute(); 
    const customersRoute = this.getCustomersRoute();

    console.log('Determined Routes:');
    console.log('  Pipeline:', pipelineRoute);
    console.log('  Contacts:', contactsRoute);
    console.log('  Customers:', customersRoute);

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
        disabled: pipelineRoute === '/access-denied' 
      },
      {
        iconPath: 'assets/Contact.png',
        text: 'Contacts',
        route: contactsRoute,
        isActive: false,
        disabled: contactsRoute === '/access-denied' 
      },
      {
        iconPath: 'assets/Company.png', 
        text: 'Customers',              
        route: customersRoute,
        isActive: false,
        disabled: customersRoute === '/access-denied' 
      },
    ];

    this.updateActiveRoute(this.router.url); 
  }

  private setupRouterListener() {
  
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    
    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveRoute(event.urlAfterRedirects);
    });
  }


  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateActiveRoute(url: string) {

    const normalizedUrl = url === '/' ? (this.navItems.find(item => item.text === 'Dashboard')?.route || '/dashboard') : url;
    this.navItems = this.navItems.map(item => ({
      ...item,
    
      isActive: item.route !== '/access-denied' &&
                  (normalizedUrl === item.route || (item.route !== '/' && normalizedUrl.startsWith(item.route + '/')))
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
      document.body.style.overflow = '';
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

  navigate(item: NavItem) { 
    if (item.route === '/access-denied') {
      console.warn(`Navigation to "${item.text}" blocked due to access denied.`);
 
      return;
    }
    this.router.navigate([item.route]);
    this.closeMobileMenuIfOpen(); 
  }

  

  getPipelineRoute(): string {
  
    if (this.auth.hasPrivilege('Overview')) { 
      return '/overview';
    } else if (this.auth.hasPrivilege('PipelineDetailAccess')) { 
      return '/pipeline';
    } else {
      console.warn('User lacks "Overview" and "PipelineDetailAccess" privileges for Pipeline.');
      return '/access-denied'; 
    }
  }

  getContactsRoute(): string {
    if (this.auth.hasPrivilege('ViewContacts')) {
      return '/contacts';
    } else {
      console.warn('User lacks "ViewContacts" privilege.');
      return '/access-denied'; 
    }
  }

  getCustomersRoute(): string { 
    if (this.auth.hasPrivilege('ViewCustomers')) {
      return '/companies'; 
    } else {
      console.warn('User lacks "ViewCustomers" privilege.');
      return '/access-denied'; 
    }
  }
}