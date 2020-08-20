import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { CustomValidators } from 'ng2-validation';
import { ActivatedRoute } from '@angular/router';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-forget-pwd',
  templateUrl: './forget-pwd.component.html',
  styleUrls: ['./forget-pwd.component.scss']
})
export class ForgetPwdComponent implements OnInit {
  pwdForm: FormGroup;
  typePassword: boolean;
  email: string;
  constructor(private fb: FormBuilder, public userService: UserService,
    private appear: AppConfirmService,
    private loader: AppLoaderService,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
     this.email = params.email;
  });
    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

    this.pwdForm = this.fb.group(
      {
        pwdotp: ['', Validators.required],
        password: password,
        confirmPassword: confirmPassword
      }
    );
  }
  onSubmit() {
   this.loader.open();
   this.pwdForm.value.email = this.email;
    this.userService.resetPwd(this.pwdForm.value).subscribe(res => {
      this.loader.close();
      this.confirmMsg('Success', 'Your password has been updated, please login');
    }, err => {
      this.loader.close();
      const msg = err.error;
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
