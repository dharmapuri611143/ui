import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from '../../../shared/services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [egretAnimations]
})
export class CartComponent implements OnInit, OnDestroy {
  cartList = [];
  cartDetails: any;
  public total: number = 0;
  public subTotal: number = 0;
  public vat: number = 18;
  public subs1: Subscription;
  public subs2: Subscription;
  public subs3: Subscription;
  clientUrl = '';
  constructor(
    private api: ApiService,
    private loader: AppLoaderService,
    public sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private appear: AppConfirmService,
  ) {
    this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
  }

  ngOnInit() {
    this.getCart();
  }
  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
    if (this.subs3) {
      this.subs3.unsubscribe();
    }

  }
  getCart() {
    let user = JSON.parse(localStorage.getItem('user'));
    if ((user || {})._id) {
      this.loader.open();
      this.subs1 = this.api.getCartList()
        .subscribe(res => {
          if (res && res.courses && res.courses.length > 0) {
            this.cartDetails = res;
            this.cartList = res.courses;
            this.subTotal  = 0;
            this.total = 0;
            let courseList = [];
            for (let item of this.cartList) {
              let path = item.image;
              path = path.substr(16)
              item.image = this.clientUrl + path;
              courseList.push(item);
              if ((item || {}).price) {
                this.total += item.price;
                this.subTotal += item.price;
              }
            }
            this.cartDetails.courses = courseList;
          } else {
            this.cartList = [];
          }
          this.changeDetectorRef.detectChanges();
          this.loader.close();
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    } else {
      this.confirmMsg('Validation', 'Please signin to enter cart list!!');
    }
  }

  removeProduct(cartItem) {
    this.loader.open();
    this.subs2 = this.api.deleteFromCartList([cartItem])
      .subscribe(res => {
        this.changeDetectorRef.detectChanges();
        this.loader.close();
        this.confirmMsg('Success', 'Product has been removed from cart.');
        this.getCart();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  clearCart() {
    this.loader.open();
    this.subs3 = this.api.deleteList().subscribe(res => {
      this.cartList = [];
      this.getCart();
      console.log('clear list', res);
      this.loader.close();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
