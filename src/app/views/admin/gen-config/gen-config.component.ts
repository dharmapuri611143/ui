import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { ApiService } from '../../../shared/services/api.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-gen-config',
  templateUrl: './gen-config.component.html',
  styleUrls: ['./gen-config.component.scss'],
  animations: egretAnimations
})
export class GenConfigComponent implements OnInit, OnDestroy {
  suFiles = [];
  private clientUrl = '';  
  public getItemSub: Subscription;
  uploadSub1: Subscription;
  saveSub: Subscription;
  homeSliderList = [];
  constructor(public api: ApiService,
    @Inject(DOCUMENT) private document: Document,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    public sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef) {
      this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
     }

  ngOnInit() {
    setTimeout(() => {
      this.getHomeSlider();
    }, 200);
  }

  getHomeSlider() {
    this.uploadSub1 = this.api.homeSlider()
    .subscribe(res => {
      let homeArray = [];
      for(let item of res) {
        let path = item.image;
        path = path.substr(16)
        item.image =  this.clientUrl + path;
        homeArray.push(item);
      }
     
      this.homeSliderList = homeArray;
      this.changeDetectorRef.detectChanges();
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }
  onImageChange(event) {
    this.suFiles = event.target.files;
  }
  saveHomeImg() {
    if (this.suFiles.length === 0) {
      Swal.fire({type: 'warning',
      title: 'Validation',
      text: 'Please select file'});
        return;
    } else {
      this.loader.open();
      const formData = new FormData();
      for (const file of this.suFiles) {
        formData.append('files', file);
      }
      this.uploadSub1 = this.api.uploadHomeSlider(formData)
      .subscribe(res => {
        this.loader.close();
        this.getHomeSlider();
        this.changeDetectorRef.detectChanges();
        this.confirmMsg('Success', 'Home silder successfully uploaded');
      }, err => {
        this.loader.open();
        this.confirmMsg('Fail', err.error);
      });
    }
  }
  deleteHomeImage(data){
    this.loader.open();
    this.api.homeSliderD(data)
    .subscribe(res => {
      this.loader.close();
      this.getHomeSlider();
      this.changeDetectorRef.detectChanges();
      this.confirmMsg('Success', 'Home silder successfully deleted');
    }, err => {
      this.loader.open();
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
    if (this.saveSub) {
      this.saveSub.unsubscribe();
    }
  }
  
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
