import { CustomValidators } from 'ng2-validation';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.component.html',
  styleUrls: ['./signup2.component.scss']
})
export class Signup2Component implements OnInit {
  signupForm: FormGroup;
  typePassword: boolean;
  constructor(private fb: FormBuilder, private loader: AppLoaderService, public userService: UserService,
    private snack: MatSnackBar, private appear: AppConfirmService, public router: Router) { }

  ngOnInit() {
    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    this.signupForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: [''],
        username: ['', Validators.required],
        phone: ['', [Validators.required,
        Validators.maxLength(10),
        Validators.pattern('[0-9]\\d{9}')]],
        email: ['', [Validators.required, Validators.email]],
        hashedPassword: password,
        confirmPassword: confirmPassword,
        agreed: [false, Validators.required]
      }
    );
  }
  
  onSubmit() {
    this.loader.open();
    this.signupForm.value.userId = this.signupForm.value.email;
    this.signupForm.value.role = 'student';
    this.signupForm.value.status = 'Active';
    this.signupForm.value.fullName = this.signupForm.value.firstName + ' '+this.signupForm.value.lastName;
    this.userService.registerUser(this.signupForm.value).subscribe(res => {
      this.loader.close();
      this.confirmMsg('Success', 'User Successfully created.');
      sessionStorage.removeItem('product_back');
      setTimeout(()=>{
        this.router.navigate(['/sessions/signin']);
      },1000)
    }, err => {
      this.loader.close();
      let msg = err.error;
      if (err.status === 0) {
        msg = 'Internal server is down, please wait for a while and login again';
      }
      this.confirmMsg('Fail', msg);
    });
  }
  togglePassword() {
    this.typePassword = !this.typePassword;
  };

  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
