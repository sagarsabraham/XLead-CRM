// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'angular-project';
// }


import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
<<<<<<< HEAD
  title = 'XLeadV1.0';
}
=======
  isSidenavOpen = true;
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
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.navItems = this.navItems.map(item => ({
        ...item,
        isActive: event.urlAfterRedirects === item.route,
      }));
    });
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }


}
>>>>>>> 325271a8456b435c271682d4f14c87eb343b1e6d
