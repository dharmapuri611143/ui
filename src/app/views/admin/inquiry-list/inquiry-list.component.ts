import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { ApiService } from '../../../shared/services/api.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-inquiry-list',
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./inquiry-list.component.scss'],
  animations: egretAnimations
})
export class InquiryListComponent implements OnInit, OnDestroy {
  public subs1: Subscription;
  public getItemSub: Subscription;
  public items = {
    limit: 10,
    skip: 1,
    count: 0,
    offset: 0,
    docs: [],
    page: 1,
    pages: 0,
    total: 0,
  };
  searchString: string;
  tableReq: any = {};
  tFlag = false;
  sp: any;
  userDetail: any;
  constructor(
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private api: ApiService,
    private appear: AppConfirmService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userDetail = this.userService.user();
    this.sp = JSON.parse(sessionStorage.getItem('sp'));
    this.getItems();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
  }
  getItems() {
    this.loader.open();
    this.tableReq['limit'] = this.items.limit;
    this.tableReq['skip'] = this.items.skip;
    this.getItemSub = this.api.fetchInquiry(this.tableReq)
      .subscribe(res => {
        console.log(res);
        this.items.docs = res.docs;
        this.items.count = res.count;
        this.items.total = res.total;
        this.items.offset = res.page - 1;
        this.changeDetectorRef.detectChanges();
        this.loader.close();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }

  setPage(pageInfo) {
    console.log(pageInfo);
    this.items.limit = pageInfo.pageSize;
    this.items.skip = pageInfo.offset + 1;
    this.getItems();
  }
  filter() {
    this.tableReq['searchString'] = this.searchString;
    if (this.tFlag === false) {
      setTimeout(() => {
        this.getItems();
        this.tFlag = false;
      }, 1000);
    }
    this.tFlag = true;
  }

  statusChange(id, status) {
    // 'Open', 'Inprocess', 'Closed'
    if (status === 'Open') {
      status = 'Inprocess';
    } else if (status === 'Inprocess') {
      status = 'Closed';
    } else {
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Inquiry status will be changed to ' + status,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs1 = this.api.updateInquiry({status: status, _id: id}).subscribe(res => {
          Swal.fire(
            'Updated!',
            'Status updated successfully',
            'success'
          );
          this.getItems();
        }, err => {
          Swal.fire(
            'Fail!',
            err.error,
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        );
      }
    });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
