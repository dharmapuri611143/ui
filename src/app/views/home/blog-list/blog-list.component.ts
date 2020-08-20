import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
  animations: egretAnimations
})
export class BlogListComponent implements OnInit, OnDestroy {
  public items: any[];
  public getItemSub: Subscription;
  uploadSub1: Subscription;
  public viewMode: string = 'grid-view';
  private clientUrl = '';
  rootCategories: any = [];
  filter = { rootCategory: '', category: '' };
  constructor(
    private dialog: MatDialog,
    private appear: AppConfirmService,
    private loader: AppLoaderService,
    private api: ApiService,
    public sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
  }

  ngOnInit() {
    this.getItems();
    this.getCategory();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.uploadSub1) {
      this.uploadSub1.unsubscribe();
    }
  }
  getCategory() {
    this.api.blogCatRootFetch({}).subscribe(
      result => {
        console.log('result', result);
        this.rootCategories = result;
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }
  getItems() {
    this.loader.open();
    this.getItemSub = this.api.blogFetch(this.filter)
      .subscribe(data => {
        let dataArray = [];
        for (let item of data) {
          if ((item || {}).image) {
            let path = item.image;
            path = path.substr(16)
            item.image = this.clientUrl + path;
          }
          dataArray.push(item);
        }

        this.items = dataArray;
        this.loader.close();
        console.log(data);
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error.msg);
      });
  }
  initItem() {
    this.filter = { rootCategory: '', category: '' };
    console.log('call')
    this.getItems();
  }
  filterBlog(value, flag) {
    console.log('value', value, flag);
    if (flag === 'rootcat') {
      this.filter.category = '';
      this.filter.rootCategory = value;
    } else if (flag = 'subcat') {
      this.filter.category = value;
    }
    this.getItems();
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
