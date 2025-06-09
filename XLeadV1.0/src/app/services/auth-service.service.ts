import { Injectable } from '@angular/core';

interface Privilege {
  id: number;
  privilegeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId: number = 4;
  privileges: Privilege[] = [];

  setPrivileges(privs: Privilege[]) {
    this.privileges = privs;
    console.log('Privileges set:', this.privileges); 
  }

  hasPrivilege(privilegeName: string): boolean {
    const hasIt = this.privileges.some(priv => priv.privilegeName === privilegeName);
    console.log(`Checking privilege '${privilegeName}':`, hasIt); 
    return hasIt;
  }
   getUserId(): number {
    return this.userId;
  }
}