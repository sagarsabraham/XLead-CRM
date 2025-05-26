import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit{
  // @Input() pageTitle: string = '';

  profile = {
    name: 'Subash Joseph',
    role: 'Admin',
  };


  pageTitle: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.getRouteTitle(this.activatedRoute))
      )
      .subscribe(title => {
        this.pageTitle = title || '';
      });
  }

  private getRouteTitle(route: ActivatedRoute): string | undefined {
    let currentRoute = route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return currentRoute.snapshot.data['title'];
  }
}
