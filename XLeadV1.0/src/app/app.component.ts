import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthServiceService } from './services/auth-service.service';
import { PrivilegeServiceService } from './services/privilege-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  showTopbar = true;

  constructor(private router: Router,  private auth: AuthServiceService,
    private privilegeService: PrivilegeServiceService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide topbar for '/pipeline' route
        this.showTopbar = !event.urlAfterRedirects.includes('/pipeline');
      }
    });
  }
// app.component.ts
ngOnInit(): void {
  console.log('AppComponent: ngOnInit - Fetching privileges for userId:', this.auth.userId);
  this.privilegeService.getPrivileges(this.auth.userId).subscribe(privs => {
    console.log('AppComponent: Privileges received:', privs);
    this.auth.setPrivileges(privs); // This will now emit through the BehaviorSubject
  });
}

}