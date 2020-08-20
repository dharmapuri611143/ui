import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ApiService } from 'app/shared/services/api.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-breviews',
  templateUrl: './breviews.component.html',
  styleUrls: ['./breviews.component.scss'],
  animations: egretAnimations
})
export class BreviewsComponent implements OnInit {
  public items = {
    limit: 10,
    skip: 0,
    count: 0,
    offset: 0,
    docs: [],
    page: 1,
    pages: 0,
    total: 0,
  };
  tableReq: any = {};
  tFlag = false;
  limits = [5, 10, 25];
  sub1: Subscription;
  sub2: Subscription;
  public products$: Observable<any>;
  public filterForm: FormGroup; 
  public subs1: Subscription;
  public subs2: Subscription;
  constructor(private fb: FormBuilder, private loader: AppLoaderService,
    private api: ApiService, private appear: AppConfirmService,private cdf: ChangeDetectorRef) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      limit: [10],
      filterText: [''],
    })
    setTimeout(() => {
      this.getItems()
    }, 200);
  }
  getItems() {
    setTimeout(() => {
      this.loader.open();
    });
    this.tableReq['limit'] = this.filterForm.value.limit;
    this.tableReq['skip'] = this.items.skip;
    this.tableReq['filter'] = this.filterForm.value;
    this.sub2 = this.api.fetchAllbReview(this.tableReq)
      .subscribe(res => {
        console.log(res);
        this.items.docs = res.docs;
        this.items.count = res.count;
        this.items.total = res.total;
        this.items.offset = res.page - 1;
        this.cdf.detectChanges();
        setTimeout(() => {
          this.loader.close();
        },100);
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  setPage(pageInfo) {
    // this.items.skip = pageInfo.offset;
    if(pageInfo.offset === 0) {
      this.items.skip = 0;
    } else {
      this.items.skip = (pageInfo.offset*pageInfo.limit) ;
    }
    this.getItems();
  }
  searchSubmit() {
    if (this.tFlag === false) {
      setTimeout(() => {
        this.getItems();
        this.tFlag = false;
      }, 1000);
    }
    this.tFlag = true;
  }
  onLimitChange(){
    this.items.limit = this.filterForm.value.limit;
    this.items.skip = 0;
    this.getItems();
  }
  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
   if (this.subs2) {
      this.subs2.unsubscribe();
    }
    if(this.sub1) {
      this.sub1.unsubscribe();
    }
    if(this.sub2) {
      this.sub2.unsubscribe();
    }
  }
  deleteReview(id){
    this.loader.open();
    this.sub1= this.api.removebReview(id).subscribe(res => {
      this.confirmMsg('Success', 'Review has been deleted!!');
      this.loader.close();
      this.getItems();
    }, err =>{
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    })
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
