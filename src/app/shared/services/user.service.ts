import { Injectable, Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { EndPoint } from './server.service';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from 'angularx-social-login';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  expiredDate: any;
  userId: any;
  userDetails: any;
  private messageSource = new BehaviorSubject(0);
  currentNotiCount = this.messageSource.asObservable();
  @Output() logoutEvent: EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient, private authService: AuthService,
    public router: Router,
    private location: Location) {
    this.userDetails = JSON.parse(localStorage.getItem('user'));
  }
 // ok
  public signinUser(user: any): any {
    this.expiredDate = new Date();
    this.expiredDate.setDate(this.expiredDate.getDate() + 7);

    return this.http.post<any>(EndPoint() + 'users/login', user)
      .map(res => {
        // login successful if there's a jwt token in the response
        if (res && res.accessToken) {
          this.setSession(res);
        }
        return res;
      });
  }
  socialSignin(user: any) {
    this.expiredDate = new Date();
    this.expiredDate.setDate(this.expiredDate.getDate() + 7);
    return this.http.post<any>(EndPoint() + 'users/social/login', user)
      .map(res => {
        // login successful if there's a jwt token in the response
        if (res && res.accessToken) {
          this.setSession(res);
        }
        return res;
      });
  }
  public setSession(authResult): void {
    if (authResult.auth) {
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('user', JSON.stringify(authResult.user));
    }
  }

  public isAvtive() { return this.http.post<any>(EndPoint() + 'users/isactive', {token: localStorage.getItem('access_token')});}
 // ok
  public logout(userBody?): void {
    let flag = false;
    let user = JSON.parse(localStorage.getItem('user'));
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    if (this.user().slogin) {
      this.authService.signOut();
    }
    if (!(user ||{}).email) {
      flag = true;
      user = userBody;
    }
    this.http.post<any>(EndPoint() + 'users/logout', user)
      .subscribe(res => {
        if (!flag) {
          this.router.navigate(['/home']);
        }
      }, err => {
        console.log('error while logout'+err.error);
      });
  }

  public user() {
    const userDetails = JSON.parse(localStorage.getItem('user'));
    if ((userDetails || {})._id) {
      return userDetails;
    } else {
      return { role: 'student' };
    }
  }
  // ok
  registerUser(body) { return this.http.post<any>(EndPoint() + `users/register`, body); }
  update(id: string, body: any) { return this.http.put<any>(EndPoint() + `users/${id}`, body); }
  pwdChange(body) { return this.http.post<any>(EndPoint() + `users/password`, body); }
  resetPwd(body) { return this.http.post<any>(EndPoint() + `users/resetpwd`, body); }
  getById(id: string) { return this.http.get<any>(EndPoint() + `users/${id}`); }
  getUsers(body: any) { return this.http.post<any>(EndPoint() + `users/`, body); }
  fetchByOne(body: any) { return this.http.post<any>(EndPoint() + `users/fetchbyone`, body); }
  forgetPwd(body: any) { return this.http.post<any>(EndPoint() + `users/forgetpwd`, body); }
  deleteUser(id: string) { return this.http.delete<any>(EndPoint() + `users/${id}`); }
  fetchRole() { return this.http.post<any>(EndPoint() + `users/fetchrold`, {}); };
  uploadProfilePic(body: any) { return this.http.post<any>(EndPoint() + `users/profilepicu`, body); };
  getNotification() {
    this.userId = this.user()._id;
    return this.http.post<any>(EndPoint() + `noti/lista`, { to: this.userId });
  }
  mailVerify(body) { return this.http.post<any>(EndPoint() + `users/mailverify`, body); }
  sendMailVerify(body) { return this.http.post<any>(EndPoint() + `users/sendmailverify`,body); }
  findOne(body) { return this.http.post<any>(EndPoint() + `users/findone`,body); }
  
  changeNoti(count) {
    this.messageSource.next(count);
  }
  unReadN(id: string) {
    return this.http.put<any>(EndPoint() + `noti/${id}`, {});
  }

  dashboardRouter(role) {
    console.log('role', role);
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'super admin') {
      this.router.navigate(['/admin']);
    }else if (role === 'student') {
      if (sessionStorage.getItem('product_back') === 'ok') {
        sessionStorage.removeItem('product_back');
        this.location.back();
      } else {
        this.router.navigate(['/student']);
      }
    } else if (role === 'tutor') {
      this.router.navigate(['/tutor']);
    } else if (role === '404') {
      this.router.navigate(['/sessions/404']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
