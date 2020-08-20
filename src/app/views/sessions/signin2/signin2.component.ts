import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { MatSnackBar } from '@angular/material';
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider, AuthService, SocialUser } from 'angularx-social-login';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import Swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-signin2',
  templateUrl: './signin2.component.html',
  styleUrls: ['./signin2.component.scss']
})
export class Signin2Component implements OnInit {
  typePassword: boolean = false;
  signinForm: FormGroup;
  forgetPwdForm: FormGroup;
  forgetPwd = false;
  userEmail: string;
  userData: any;
  currUser: any;
  private user: SocialUser;
  private loggedIn: boolean;
  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true
  });
  constructor(private fb: FormBuilder, private loader: AppLoaderService, public userService: UserService,
    private snack: MatSnackBar, private appear: AppConfirmService, private authService: AuthService) { }

  ngOnInit() {
    const password = new FormControl('', Validators.required);
    this.signinForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        hashedPassword: password
      }
    );
    this.forgetPwdForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]]
      }
    );

    // if user is loged in get user details here.
    // user.photoUrl, user.name, user.email
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  onSubmit() {
    if(this.currUser && !(this.currUser ||{}).emailVerify) {
      this.confirmMsg('Fail', 'Please verify your email ID');
      return;
    }
    if (!this.signinForm.invalid) {
      this.loader.open();
      this.userService.signinUser(this.signinForm.value).subscribe(res => {
        this.loader.close();
        localStorage.removeItem('loginFlag');
        this.userService.dashboardRouter(res.user.role);
      }, err => {
        console.log('err', err);
        console.log('err', err.error);
        this.loader.close();
        let msg = err.error;
        if (err.status === 0) {
          msg = 'Internal server is down, please wait for a while and login again';
          this.confirmMsg('Fail', msg);
        } else if (err.status === 422) {
          this.swalWithBootstrapButtons.fire({
            title: 'Do you want to logout!',
            text: err.error,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Logout!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
              this.userService.logout(this.signinForm.value);
              setTimeout(() => {
                this.onSubmit();
              }, 500);
            }
          });
        } else {
          this.confirmMsg('Fail', msg);
        }
      });
    }
  }
  submitEmail() {
    if (!this.forgetPwdForm.invalid) {
      this.loader.open();
      this.userService.forgetPwd(this.forgetPwdForm.value).subscribe(res => {
        this.loader.close();
        this.confirmMsg('Success', res.msg);
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
    } else {
      return;
    }
  }
  togglePassword() {
    this.typePassword = !this.typePassword;
  };

  openPwdForm() {
    if (this.forgetPwd) {
      this.forgetPwd = false;
    } else {
      this.forgetPwd = true;
    }
  }
  checkEmailId(){
    if(this.signinForm.value.email) {
      if(!this.signinForm.controls.email.errors) {
        this.loader.open();
        this.userService.findOne({email: this.signinForm.value.email}).subscribe(res => {
          this.currUser = res;
          setTimeout(() => {
            this.loader.close();
          }, 200);
          
        }, err => {
          setTimeout(() => {
            this.loader.close();
          }, 200);
          this.confirmMsg('Fail', err.error);
        });
      } else {
        this.currUser = null;
      }
    }
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {
      console.log('google', x);
      this.loginBySocial(x);
    }, err => {
      this.confirmMsg('Fail', err);
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((x:any) => {
      console.log('facebook', x);
//       accessToken - contains an access token for the person using the app.
// expiresIn - indicates the UNIX time when the token expires and needs to be renewed.
// signedRequest - a signed parameter that contains information about the person using the app.
// userID - the ID of the person using the app.
  this.loginBySocial(x)
    }, err => {
      this.confirmMsg('Fail', err);
    });
  }

  signInWithLinkedIn(): void {
    this.authService.signIn(LinkedInLoginProvider.PROVIDER_ID).then(x => console.log('linledin', x));
  }

  loginBySocial(user) {
    this.loader.open();
    this.user = user;
    console.log('userg', user);
    this.userData = user;
    if((user ||{}).name) {
      this.userData.fullName = user.name;
    }
    this.userData.emailVerify = true;
    this.loggedIn = (user != null);
    if (this.user) {
      localStorage.setItem('loginFlag', 'true');
      this.userData.firstName = this.user.name? this.user.name : '';
      if (this.user.provider === 'GOOGLE') {
        this.userData.googleId = this.user.id;
      } else {
        this.userData.fbId = this.user.id;
      }

      this.userService.socialSignin(this.userData).subscribe(res => {
        this.loader.close();
        this.user = null;
        console.log('res user', res);
        this.userService.dashboardRouter(res.user.role);
      }, err => {
        this.loader.close();
        if (err.status === 0) {
          this.confirmMsg('Fail', 'Internal server is down, please wait for a while and login again');
        } else if (err.status === 422) {
          this.swalWithBootstrapButtons.fire({
            title: 'Do you want to logout!',
            text: err.error,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Logout!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
              console.log('this.userData', this.userData);
              this.userService.logout(this.userData);
              setTimeout(() => {
                this.loginBySocial(this.userData);
              }, 500);
            }
          });
        } else {
          console.log('error res', err);
          this.confirmMsg('Fail', err.error);
        }
      });
    }
  }
  sendVerification(){
    this.loader.open();
    this.userService.sendMailVerify({email: this.signinForm.value.email}).subscribe(res => {
      this.loader.close();
      this.confirmMsg('Success', 'Please check your registered email for verification.');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    })
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
