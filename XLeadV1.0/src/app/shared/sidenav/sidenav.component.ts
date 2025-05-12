import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }



  navItems= [
  {
    iconPath: 'assets/Dashboard.png',
    text: 'Dashboard',
    route: '/dashboard',
    isActive: true
  },
  {
    iconPath: 'assets/Pipeline.png',
    text: 'Pipeline',
    route: '/pipeline',
    isActive: false
  },
  {
    iconPath: 'assets/contacts.png',
    text: 'Contacts',
    route: '/contacts',
    isActive: false
  },
  {
    iconPath: 'assets/settings.png',
    text: 'Companies',
    route: '/companies',
    isActive: false
  }
];
  
  
  profile= [
  {
    name: 'Subash Joseph',
    role: 'Admin'
  }
]
}
