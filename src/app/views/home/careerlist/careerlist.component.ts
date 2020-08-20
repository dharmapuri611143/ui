import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-careerlist',
  templateUrl: './careerlist.component.html',
  styleUrls: ['./careerlist.component.scss'],
  animations: egretAnimations
})
export class CareerlistComponent implements OnInit, OnDestroy {
  public items = {
    limit: 30,
    skip: 1,
    count: 0,
    offset: 0,
    docs: [],
    page: 1,
    pages: 0,
    total: 0,
  };
  public filterForm: FormGroup;
  paginatlimit = [5, 10, 25];
  tableReq: any = {};
  public getItemSub: Subscription;
  uploadSub1: Subscription;
  typeList = ['Contract', 'Full Time', 'Part Time'];
  locations = ['hyd']
  categories = ['hyd']
  jobConfig: {
    categories: [],
    locations: []
  };
  public viewMode: string = 'grid-view';
  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private appear: AppConfirmService,
    private loader: AppLoaderService,
    private api: ApiService,
    private cdf: ChangeDetectorRef) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      location: [''],
      type: [''],
      category: ['']
    });
    this.getItems();
    this.fetchJobConfig();
  }

  fetchJobConfig() {
    this.getItemSub = this.api.jobConfigFetch({})
      .subscribe(res => {
        this.jobConfig = res;
        console.log('jobConfig', this.jobConfig);
        this.cdf.detectChanges();
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.uploadSub1) {
      this.uploadSub1.unsubscribe();
    }
  }
  getItems() {
    this.loader.open();
    this.tableReq['status'] = 'Active';
    this.tableReq['limit'] = this.items.limit;
    this.tableReq['skip'] = this.items.skip;
    this.getItemSub = this.api.jobsFetch(this.tableReq)
      .subscribe(res => {
        this.items.docs = res.docs;
        this.items.count = res.count;
        this.items.total = res.total;
        this.items.offset = res.page - 1;
        this.loader.close();
        this.cdf.detectChanges();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  setPage(pageInfo) {
    this.items.limit = pageInfo.pageSize;
    this.items.skip = pageInfo.offset + 1;
    this.getItems();
  }
  filter() {
    if (this.filterForm.value.location) {
      this.tableReq['location'] = this.filterForm.value.location;
    } else {
      this.tableReq['location'] = '';
    }
    if (this.filterForm.value.type) {
      this.tableReq['type'] = this.filterForm.value.type;
    } else {
      this.tableReq['type'] = '';
    }
    if (this.filterForm.value.category) {
      this.tableReq['category'] = this.filterForm.value.category;
    } else {
      this.tableReq['category'] = '';
    }
    this.getItems();
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
