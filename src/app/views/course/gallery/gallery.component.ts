import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: egretAnimations
})
export class GalleryComponent implements OnInit, OnDestroy {
  public items: any[];
  public getItemSub: Subscription;
  uploadSub1: Subscription;
  private clientUrl = '';  

  public viewMode: string = 'grid-view';
  constructor(
    private dialog: MatDialog,
    private appear: AppConfirmService,
    private loader: AppLoaderService,
    private api: ApiService,
    public sanitizer: DomSanitizer,
    private cdf: ChangeDetectorRef) {
      this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
     }

  ngOnInit() {
    this.getItems();
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
  this.getItemSub = this.api.getCategories('')
    .subscribe(data => {
      let dataArray = [];
      for(let item of data) {
        let path = item.image;
        path = path.substr(16)
        item.image =  this.clientUrl + path;
        dataArray.push(item);
      }
      this.items = dataArray;
      this.loader.close();
      this.cdf.detectChanges();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error.msg);
    });
}
confirmMsg(title, msg) {
  this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
}
}
