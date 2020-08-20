import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { MatDialogRef, MatDialog } from '@angular/material';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss'],
  animations: egretAnimations
})

export class CareersComponent implements OnInit, OnDestroy {
  public getItemSub: Subscription;
  uploadSub1: Subscription;
  public subs1: Subscription;
  public subs2: Subscription;
  public subs3: Subscription;
  public subs4: Subscription;
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
  paginatlimit = [5, 10, 25];
  tableReq: any = {};
  searchString: string;
  constructor(public dialog: MatDialog,
    private appear: AppConfirmService,
    private loader: AppLoaderService,
    private api: ApiService,
    private cdf: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(() => {
      this.getItems();
    }, 500);
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
    this.getItemSub = this.api.jobsFetch(this.tableReq)
      .subscribe(res => {
        this.items.docs = res.docs;
        this.items.count = res.count;
        this.items.total = res.total;
        this.items.offset = res.page - 1;
        this.cdf.detectChanges();
        this.loader.close();
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
    this.tableReq.searchString = this.searchString;
    this.getItems();
  }

  statusChange(id, status) {
    // 'Open', 'Inprocess', 'Closed'
    if (status === 'Active') {
      status = 'Inactive';
    } else if (status === 'Inactive') {
      status = 'Active';
    } 
    Swal.fire({
      title: 'Are you sure?',
      text: 'Jobs status will be changed to ' + status,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs1 = this.api.jobsAdd({status: status, _id: id}).subscribe(res => {
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
