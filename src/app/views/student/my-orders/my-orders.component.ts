import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
  animations: [egretAnimations]
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  user: any;
  orderList = [];
  private clientUrl = '';  
  public viewMode: string = 'grid-view';
  private productSub: Subscription;
  constructor(
    private loader: AppLoaderService,
    private api: ApiService,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private appear: AppConfirmService,
    private changeDetectorRef: ChangeDetectorRef) { 
      this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
    }

  ngOnInit() {
      this.getOrderList();
  }
  ngOnDestroy() {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
  }
  getOrderList() {
    this.loader.open();
    this.productSub = this.api.getOrderList().subscribe(res => {
      console.log('order list: ', res);
     
      this.orderList = [];
      for(let order of res) {
        let cArray = [];
        for(let course of order.course){
          if((course ||{}).image) {
            let path = course.image;
            path = path.substr(16);
            course.image =  this.clientUrl + path;
          }
          cArray.push(course);
        }
        order.course = cArray;
        this.orderList.push(order);
      }
      this.loader.close();
      this.changeDetectorRef.detectChanges();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
