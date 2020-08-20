import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../shared/services/api.service';
import { Subscription } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import * as _ from 'lodash';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserRegPopupComponent } from '../user-reg-popup/user-reg-popup.component';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  animations: egretAnimations
})
export class CustomerListComponent implements OnInit, OnDestroy {
  public users = {
    limit: 10,
    skip: 1,
    count: 0,
    offset: 0,
    page: 1,
    pages: 0,
    docs: [],
    total: 0
  };

  paginatlimit = [5, 10, 25, 50];
  tableReq: any = {};
  searchString: string;
  fetchSub: Subscription;
  updateSub: Subscription;
  public subs1: Subscription;
  public subs2: Subscription;
  tFlag = false;

  constructor(
    private api: ApiService,
    public sanitizer: DomSanitizer,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    public userService: UserService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.loader.open();
    this.tableReq['limit'] = this.users.limit;
    this.tableReq['skip'] = this.users.skip;
    this.tableReq['role'] = 'student';
    this.fetchSub = this.userService.getUsers(this.tableReq).subscribe(res => {
      this.users = res;
      this.users.offset = res.page - 1;
      this.changeDetectorRef.detectChanges();
      this.loader.close();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }
  setPage(pageInfo) {
    console.log(pageInfo)
    this.users.limit = pageInfo.pageSize;
    this.users.skip = pageInfo.offset + 1;
    this.getUsers();
  }
  onSort(e) {
    // onSort(e) {
    //   this.sort = {};
    //   this.sort[e.sorts[0].prop] = e.sorts[0].dir === 'desc' ? -1 : 1;
    //   this.getItems();
    // }
  }
  filter() {
    this.tableReq['searchString'] = this.searchString;
    if (this.tFlag === false) {
      setTimeout(() => {
        this.getUsers();
        this.tFlag = false;
      }, 1000);
    }
    this.tFlag = true;
  }

  update(id: string, value: string, key: string) {
    this.loader.open();
    const body: any = {};
    if (value === 'Active') {
      body[key] = 'Inactive';
    } else {
      body[key] = 'Active';
    }
    this.updateSub = this.userService.update(id, body).subscribe(res => {
      this.loader.close();
      setTimeout(() => {
        this.getUsers();
      }, 500);
      this.confirmMsg('Success', 'This user is ' + body[key] + ' now.');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }
  ngOnDestroy() {
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
    }
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
  }
  openPopup(){
    const dialogRef: MatDialogRef<any> =this.dialog.open(UserRegPopupComponent, {
      width: '700px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
