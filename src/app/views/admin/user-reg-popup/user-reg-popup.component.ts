import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { UserService } from 'app/shared/services/user.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { CustomValidators } from 'ng2-validation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-user-reg-popup',
  templateUrl: './user-reg-popup.component.html',
  styleUrls: ['./user-reg-popup.component.scss']
})
export class UserRegPopupComponent implements OnInit {
  signupForm: FormGroup;
  typePassword: boolean;
  constructor(private fb: FormBuilder, private loader: AppLoaderService, public userService: UserService, private appear: AppConfirmService,
    public dialogRef: MatDialogRef<UserRegPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

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
      setTimeout(()=>{
        this.dialogRef.close();
      }, 1000)
    }, err => {
      this.loader.close();
      let msg = err.error;
      if (err.status === 0) {
        msg = 'Internal server is down, please wait for a while and login again';
      }
      this.confirmMsg('Fail', msg);
    });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
  togglePassword() {
    this.typePassword = !this.typePassword;
  };
}
