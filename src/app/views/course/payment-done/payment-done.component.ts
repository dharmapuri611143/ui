import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from '../../../shared/services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-payment-done',
  templateUrl: './payment-done.component.html',
  styleUrls: ['./payment-done.component.scss'],
  animations: [egretAnimations]
})
export class PaymentDoneComponent implements OnInit, OnDestroy {
  public paymentStatus: string;
  public txnId: string;
  public orderStatus: string;
  public orderDetails: any;
  public user: any;
  public subs1: Subscription;
public subs2: Subscription;
  constructor( private route: ActivatedRoute,
    private api: ApiService,
     private loader: AppLoaderService,
    public sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private appear: AppConfirmService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.route.queryParams.subscribe(params => {
      console.log('params: ', params);
      this.paymentStatus = params.status;
      this.orderStatus = params.order;
      this.txnId = params.txnid;
      this.getOrderDetail(this.txnId);
      if (params.status === 'success') {
        this.clearCart();
      }
    });
  }
  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
   if (this.subs2) {
      this.subs2.unsubscribe();
    }
  }
  clearCart() {
    this.subs1 = this.api.deleteList().subscribe(res => {
    }, err => { this.confirmMsg('Fail', err.error); });
  }
  getOrderDetail(txnid: string) {
    this.subs2 = this.api.getOrderDetail(txnid).subscribe(res => {
      this.orderDetails = res;
      this.changeDetectorRef.detectChanges();
    }, err => { this.confirmMsg('Fail', err.error); });
  }

  print() {
    const printContents = document.getElementById('print-id');
    const WindowPrt = window.open();
    WindowPrt.document.write(printContents.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
}
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
