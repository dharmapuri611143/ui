import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material';
import Swal from 'sweetalert2';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ApiService } from 'app/shared/services/api.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
@Component({
  selector: 'app-applied-job',
  templateUrl: './applied-job.component.html',
  styleUrls: ['./applied-job.component.scss'],
  animations: egretAnimations
})
export class AppliedJobComponent implements OnInit, OnDestroy {
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
      this.getItemSub = this.api.jobsApplyFetch(this.tableReq)
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
    onStatusChange(status) {
      this.tableReq['status'] = status;
      this.getItems();
    }
    statusChange(id, status) {
      // 'Open', 'Inprocess', 'Closed'
      Swal.fire({
        title: 'Are you sure?',
        text: 'Jobs status will be changed to ' + status,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.subs1 = this.api.jobApplyUpdate({status: status, _id: id}).subscribe(res => {
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

    dDocs(dname) {
      console.log(dname)
      this.loader.open();
      this.api.downloadFile({ path: dname }).subscribe(res => {
        let splitFname = dname.split('/');
        let aLen = splitFname.length;
        splitFname = splitFname[aLen - 1];
        this.api.saveData(res.base64Data, splitFname);
        this.loader.close();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
    }
    mailTo(row) {
      window.location.href = `mailto:${row.email}?subject=Job Oppertunity - ${row.jobfor.title}&body=Dear ${row.firstName}, 
      ${row.jobfor.summary}`;
    }
    confirmMsg(title, msg) {
      this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
    }

}
