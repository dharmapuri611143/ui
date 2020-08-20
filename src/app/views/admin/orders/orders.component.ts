import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { ApiService } from '../../../shared/services/api.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AssignOrderComponent } from './assign-order/assign-order.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: egretAnimations
})
export class OrdersComponent implements OnInit, OnDestroy {
  public getItemSub: Subscription;
  public filterForm: FormGroup;
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
  filterText: string;
  tableReq: any = {};
  paginatlimit = [5, 10, 25];
  tFlag = false;
  rootCategories: any = [];
  categories: any = [];
  subjects: any = [];
  courses: any = [];
  limits = [5, 10, 25, 100];
  @ViewChild('myTable', { read: false, static: false }) table: any;
  expanded: any = {};
  constructor(
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private api: ApiService,
    private fb: FormBuilder,
    private appear: AppConfirmService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      filterText: [''],
      rootCategoryName: [''],
      categoryName: [''],
      subjectName: [''],
      courseName: [''],
      limit: [10]
    });
    setTimeout(() => {
      this.getItems()
    }, 200);
    this.getCategory();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  getItems() {
    this.loader.open();
    console.log(this.filterForm.value)
    this.tableReq['limit'] = this.filterForm.value.limit;
    this.tableReq['skip'] = this.items.skip;
    this.tableReq['filter'] = this.filterForm.value;
    this.getItemSub = this.api.fetchOrders(this.tableReq)
      .subscribe(res => {
        console.log(res);
        this.items.docs = res.docs;
        this.items.count = res.count;
        this.items.total = res.total;
        this.items.offset = res.page - 1;
        this.cdr.detectChanges();
        this.loader.close();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  onLimitChange(){
    this.items.limit = this.filterForm.value.limit;
    this.items.skip = 0;
    this.getItems();
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
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
  getCategory() {
    this.api.getCategoryDetails().subscribe(
     result => {
       this.rootCategories = result;
       this.cdr.detectChanges();
     }, err => {
       this.confirmMsg('Fail', err.error);
     });
 }
 showCategories() {
  for (const i in this.rootCategories) {
    if (this.filterForm.value.rootCategoryName && this.rootCategories[i].name === this.filterForm.value.rootCategoryName) {
      this.subjects = [];
      this.categories = this.rootCategories[i].categories;
    } else if (this.rootCategories[i].name === this.filterForm.value.rootCategoryName) {
      this.categories = this.rootCategories[i].categories;
    }
  }
  this.getItems();
  this.cdr.detectChanges();
}
onCategoryChange(cname) {
  for (const i in this.categories) {
    if (this.categories[i].name === cname) {
      this.subjects = this.categories[i].subjects;
    }
  }
  this.getItems();
  this.cdr.detectChanges();
}

getCourses(data) {
  this.loader.open();
  this.api.getCourseByOne(data).subscribe(
    result => {
      this.courses = result;
      this.loader.close();
      this.getItems();
      this.cdr.detectChanges();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
}
onCourseChange(){
  this.getItems();
}
  onDetailToggle(event) {
  }
  refundPay(payinfo) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to continue with refund process?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.loader.open();
        this.getItemSub = this.api.refundPay(payinfo)
          .subscribe(res => {
            console.log(res);
            this.confirmMsg('Success', res.message+', Refund will be credit in to your bank/card within 6 working days.');
            setTimeout(() => {
              this.getItems();
            }, 500);
            this.loader.close();
            this.cdr.detectChanges();
          }, err => {
            this.loader.close();
            this.confirmMsg('Fail', err.error);
          });
      }
    });
  }

  openPopup() {
    const dialogRef: MatDialogRef<any> =this.dialog.open(AssignOrderComponent, {
      width: '90%',
      height: '90%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getItems();
    });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
