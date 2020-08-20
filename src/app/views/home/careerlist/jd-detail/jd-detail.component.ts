import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { ApiService } from 'app/shared/services/api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-jd-detail',
  templateUrl: './jd-detail.component.html',
  styleUrls: ['./jd-detail.component.scss'],
  animations: egretAnimations
})
export class JdDetailComponent implements OnInit {
  public itemSub: Subscription;
  public getItemSub: Subscription;
  uploadSub1: Subscription;
  jobDetails: any;
  applyJobForm: FormGroup;
  jobforId: string = '';
  suFiles = [];
  saveSub: Subscription;
  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private userService: UserService,
    private appear: AppConfirmService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.jobforId = params._id;
      setTimeout(() => {
        this.getJob(params._id);
      }, 100);
    });

    this.applyJobForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required,
        Validators.maxLength(10),
        Validators.pattern('[0-9]\\d{9}')]]
      }
    );
  }
  getJob(id) {
    setTimeout(() => {
      this.loader.open();
    }, 0);

    this.itemSub = this.api.jobGetById(id).subscribe(res => {
      this.loader.close();
      this.jobDetails = res;
      this.changeDetectorRef.detectChanges();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error.msg);
    });
  }
  onSubmit() {
    if (this.suFiles.length === 0) {
      this.confirmMsg('Validation', 'Please upload your Resume');
      return;
    } else {
      this.loader.open();
      this.applyJobForm.value.jobfor = this.jobforId;
      this.saveSub = this.api.jobApply(this.applyJobForm.value).subscribe(res => {
        this.applyJobSubmit(res);
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });

    }
  }
  applyJobSubmit(jobModel) {
    let jobUpdateData: any = {_id: jobModel._id};
    const formData = new FormData();
    formData.append('files', this.suFiles[0]);
    this.uploadSub1 = this.api.jobsUploadResume(formData).subscribe(data => {
      jobUpdateData.resume = data.data[0];
      this.updateJob(jobUpdateData);
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  updateJob(jobUpdateData) {
    this.uploadSub1 = this.api.jobApplyUpdate(jobUpdateData).subscribe(data => {
      this.loader.close();
      this.confirmMsg('Success', 'Profile has been updated!');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  onImageChange(event) {
    this.suFiles = event.target.files;
  }
  ngOnDestroy() {
    if (this.itemSub) { this.itemSub.unsubscribe(); }
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.uploadSub1) {
      this.uploadSub1.unsubscribe();
    }
    if (this.saveSub) {
      this.saveSub.unsubscribe();
    }
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
