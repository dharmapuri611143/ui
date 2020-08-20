import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class IsactiveResolverService implements Resolve<any> {
  constructor(private router: Router, private userService: UserService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    return this.userService.isAvtive().pipe(
      take(1),
      mergeMap(res => {
        console.log('resolve res', res);
        if ((res || {}).isActive) {
          return of(res);
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          this.router.navigate(['/sessions/signin']);
          return EMPTY;
        }
      })
    );
  }
}
