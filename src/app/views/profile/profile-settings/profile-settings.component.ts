import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../../shared/services/user.service';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from '../../../shared/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css'],
  providers: [DatePipe]
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  userDetail: any;
  suFiles: any = [];
  public uploadSub: Subscription;
  public updateSub: Subscription;
  updateUserForm: FormGroup;
  resetPwdForm: FormGroup;
  typePassword: boolean;
  socialUserFlag = 'false';
  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public sanitizer: DomSanitizer,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    public userService: UserService,
    private api: ApiService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.userDetail = this.userService.user();
    console.log('userDetail', this.userDetail);
    if (localStorage.getItem('loginFlag')) {
      this.socialUserFlag = localStorage.getItem('loginFlag');
    }
    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    let date = this.userDetail.dateOfBirth ? this.datePipe.transform(this.userDetail.dateOfBirth, 'yyyy-MM-dd') : '';
    this.updateUserForm = this.fb.group(
      {
        username: [this.userDetail.username || '', Validators.required],
        firstName: [this.userDetail.firstName || '', Validators.required],
        lastName: [this.userDetail.lastName || ''],
        phone: [this.userDetail.phone || '', [Validators.required,
        Validators.maxLength(10),
        Validators.pattern('[0-9]\\d{9}')]],
        email: [this.userDetail.email || '', [Validators.required, Validators.email]],
        gender: [this.userDetail.gender || 'Male'],
        dateOfBirth: [date],
        address: this.fb.group({ // make a nested group
          line1: [((this.userDetail || {}).address || {}).line1 || '', [Validators.required]],
          city: [((this.userDetail || {}).address || {}).city || '', [Validators.required]],
          state: [((this.userDetail || {}).address || {}).state || '', [Validators.required]],
          pincode: [((this.userDetail || {}).address || {}).pincode || '', [Validators.required]],
          country: [((this.userDetail || {}).address || {}).country || '', [Validators.required]],
        }),
      }
    );

    if (this.socialUserFlag === 'true') {
      this.resetPwdForm = this.fb.group(
        {
          hashedPassword: password,
          confirmPassword: confirmPassword,
        }
      );
    } else {
      this.resetPwdForm = this.fb.group(
        {
          oldPassword: ['', Validators.required],
          hashedPassword: password,
          confirmPassword: confirmPassword,
        }
      );
    }
  }
  onSubmit() {
    this.loader.open();
    this.updateSub = this.userService.update(this.userDetail._id, this.updateUserForm.value).subscribe(res => {
      this.loader.close();
      this.confirmMsg('Success', 'Your details has been updated successfully, Please Re-login');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }
  onChangePwd() {
    this.loader.open();
    if (this.socialUserFlag === 'true') {
      this.resetPwdForm.value.socialFlag = true;
    }
    this.resetPwdForm.value.email = this.userDetail.email;
    this.updateSub = this.api.updatePassword(this.resetPwdForm.value).subscribe(res => {
      this.loader.close();
      this.confirmMsg('Success', 'Your password has been updated successfully, Please Re-login');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }
  onImageChange(event) {
    this.suFiles = event.target.files[0];
  }
  uploadF() {
    if (!(this.suFiles || {}).name) {
      this.confirmMsg('Validation', 'Please select the file!!');
      return;
    }
    this.loader.open();
    const formData = new FormData();
    formData.append('userId', this.userDetail._id);
    console.log('image', this.suFiles);
    formData.append('imageFile', this.suFiles, this.suFiles.name);
    this.uploadSub = this.api.uploadProfileImage(formData).subscribe(res => {
      this.loader.close();
      this.onUpdate(res, 'Profile Image successfully updated, Please Re-login');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }
  togglePassword() {
    this.typePassword = !this.typePassword;
  };
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
  onUpdate(data, msg: string) {
    let reqBody: any = {};
    reqBody['image'] = data.image;
    this.updateSub = this.userService.update(this.userDetail._id, reqBody).subscribe(res => {
      this.confirmMsg('Success', msg);
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }
  ngOnDestroy() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
  }
}
