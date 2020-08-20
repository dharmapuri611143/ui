import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private me: UserService, private router: Router, private route: ActivatedRoute) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let roles = [];
    if (localStorage.getItem('access_token')) {
      return true;
    } else {
      // this.me.dashboardRouter('');
      return true;
    }
    // const rnext: any = next;
    // if (((rnext || {}).data || {}).roles) {
    //   roles = rnext.data.roles;
    // } else if ((((rnext || {}).firstChild || {}).data || {}).roles) {
    //   roles = rnext.firstChild.data.roles;
    // } else if (((((rnext || {}).firstChild || {}).firstChild || {}).data || {}).roles) {
    //   roles = rnext.firstChild.firstChild.data.roles;
    // }
    // if (localStorage.getItem('access_token')) {
    //   if (roles.indexOf(this.me.user().role) >= 0) {
    //     return true;
    //   } else {
    //     this.me.dashboardRouter('404');
    //   }
    // }else if (roles.indexOf('student') < 0) {
    //   this.me.dashboardRouter('404');
    // } else {
    //   return true;
    // }
    // return true;
  }
}
