import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ApiService } from 'app/shared/services/api.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-career-detail',
  templateUrl: './career-detail.component.html',
  styleUrls: ['./career-detail.component.scss'],
  animations: egretAnimations
})
export class CareerDetailComponent implements OnInit {
  public itemForm: FormGroup;
  suFiles = [];
  public getItemSub: Subscription;
  uploadSub1: Subscription;
  sub1: Subscription;
  sub2: Subscription;
  saveSub: Subscription;
  _id: string;
  jobDetail: any;

  editorData = ``;
  typeList = ['Contract', 'Full Time', 'Part Time'];
  locations = ['hyd']
  categories = ['hyd']
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private appear: AppConfirmService,
    private loader: AppLoaderService,
    private api: ApiService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.buildItemForm({});
    this.route.params.subscribe(params => {
      this._id = params['id'];
      if (this._id) {
        this.fetchById();
      } else {
        this.buildItemForm({});
      }
    });
    this.fetchJobConfig();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.uploadSub1) {
      this.uploadSub1.unsubscribe();
    }
    if (this.saveSub) {
      this.saveSub.unsubscribe();
    }
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }
  fetchById() {
    this.getItemSub = this.api.jobGetById(this._id).subscribe(res => {
      this.jobDetail = res;
      this.buildItemForm(res);
      this.editorData = res.jd;
      this.changeDetectorRef.detectChanges();
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      title: [item.title || '', Validators.required],
      summary: [item.summary || '', Validators.required],
      category: [item.category || ''],// HR, IT, Hardware
      location: [item.location || '', Validators.required],
      type: [item.type || '', Validators.required],
    });
  }

  submit() {
    if (this._id) {
      this.itemForm.value._id = this._id;
    }
    this.loader.open();
    this.itemForm.value.status = 'Active';
    this.itemForm.value.jd = this.editorData;
    console.log('this.itemForm.value', this.itemForm.value);
    this.saveSub = this.api.jobsAdd(this.itemForm.value).subscribe(res => {
      this.loader.close();
      this.changeDetectorRef.detectChanges();
      this.confirmMsg('Success', 'Job has been updated!');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  onContentChanged(e) {
  }
  onSelectionChanged(e) {
  }
  fetchJobConfig() {
    this.saveSub = this.api.jobConfigFetch({}).subscribe(res => {
      if(res.locations) {
        this.locations = res.locations;
      }
      if(res.categories) {
        this.categories = res.categories;
      }
      this.changeDetectorRef.detectChanges();
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }
  addCatLoc(value, flag) {
    let body:any = {};
    body[flag] = value;
    body.flag = flag;
    this.loader.open();
    this.saveSub = this.api.jobConfigAdd(body).subscribe(res => {
      this.loader.close();
      this.fetchJobConfig();
      this.changeDetectorRef.detectChanges();
      this.confirmMsg('Success', flag+' has been updated!');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  locCatDelete(value, flag) {
    let body:any = {};
    body[flag] = value;
    body.flag = flag;
    this.loader.open();
    this.saveSub = this.api.JobConfigRevmove(body).subscribe(res => {
      this.loader.close();
      this.fetchJobConfig();
      this.changeDetectorRef.detectChanges();
      this.confirmMsg('Success', flag+' has been deleted!');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
