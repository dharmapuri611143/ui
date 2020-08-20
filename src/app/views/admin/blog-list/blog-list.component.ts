import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { MatDialogRef, MatDialog } from '@angular/material';
import { BlogCategoryModalComponent } from './blog-category-modal/blog-category-modal.component';
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
  constructor(
    public dialog: MatDialog,
    private appear: AppConfirmService,
    private loader: AppLoaderService,
    private api: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.getItems();
    }, 500);
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
    this.getItemSub = this.api.blogFetch({role: 'Super Admin'})
      .subscribe(data => {
        this.items = data;
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }

  deleteItem(row) {
    this.loader.open();
    this.uploadSub1 = this.api.blogDelete({ _id: row._id })
      .subscribe(data => {
        this.getItems();
        this.loader.close();
        this.confirmMsg('Success', 'Current Affair Deleted!');
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }
  openPopup(){
    const dialogRef: MatDialogRef<any> =this.dialog.open(BlogCategoryModalComponent, {
      width: '1000px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // action
    });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
