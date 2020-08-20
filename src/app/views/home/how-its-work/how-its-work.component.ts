import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';
@Component({
  selector: 'app-how-its-work',
  templateUrl: './how-its-work.component.html',
  styleUrls: ['./how-its-work.component.scss'],
  animations: egretAnimations
})
export class HowItsWorkComponent implements OnInit, OnDestroy, AfterViewInit {
  homeReports: any;
  category: any = [];
  courses: any = [];
  rootCategories: Object[] = [{}];
  subjects: any;
  subject = '';
  public itemSub: Subscription;
  public subs1: Subscription;
  public subs2: Subscription;
  public subs3: Subscription;
  public subs4: Subscription;
  public subs5: Subscription;
  private clientUrl = '';  

  constructor(public sanitizer: DomSanitizer,
    private api: ApiService,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    private changeDetectorRef: ChangeDetectorRef) {
      this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
     }
  ngAfterViewInit() {
  }
  ngOnInit() {
    this.getShortReport();
    this.getCategory();
  }
  getShortReport() {
    this.subs1 = this.api.getShortReport().subscribe(res => {
      this.homeReports = res;
      this.changeDetectorRef.detectChanges();
    }, err => { this.confirmMsg('Fail', err.error); });
  }
  getCourseByCat(event) {
    this.courses = {};
    if (((event || {}).tab || {}).textLabel) {
      this.subs2 = this.api.getCurrCourse({ name: event.tab.textLabel }).subscribe(res => {
        let homeArray = [];
      for(let item of res) {
        let path = item.image;
        path = path.substr(16)
        item.image =  this.clientUrl + path;
        homeArray.push(item);
      }
        this.courses = homeArray;
        jQuery(function ($) {
          let owl = $('.owl-course');
          owl.owlCarousel({
            margin: 0,
            loop: true,
            rewind: true,
            nav: false,
            touchDrag: true,
            responsiveClass: true,
            // autoplay: true,
            // autoplayTimeout: 2000,
            responsive: {
              0: {
                items: 1
              },
              600: {
                items: 2
              },
              1000: {
                items: 5
              },
              1500: {
                items: 6
              }
            }
          });
          $('.customNextBtnhw').click(function () {
            owl.trigger('next.owl.carousel');
          });
          $('.customPrevBtnhw').click(function () {
            owl.trigger('prev.owl.carousel');
          });
        });
        this.changeDetectorRef.detectChanges();
      }, err => { this.confirmMsg('Fail', err.error); });
    }

  }
  getCategory() {
    this.subs3 = this.api.getCategory().subscribe(res => {
      this.category = res.reverse();
      this.getCourseByCat(this.category[0].name);
      this.changeDetectorRef.detectChanges();
    }, err => { this.confirmMsg('Fail', err.error); });
  }

  getRootCategoies() {
    this.subs4 = this.api.getRootCategories().subscribe(res => {
      res.forEach(element => {
        this.rootCategories.push(element);
      });
      this.changeDetectorRef.detectChanges();
    }, err => { this.confirmMsg('Fail', err.error); });
  }
  getSubjectList() {
    this.subs5 = this.api.getSubjectList().subscribe(res => {
      console.log('subjec: ', res);
      this.subjects = res;
      this.changeDetectorRef.detectChanges();
    }, err => { this.confirmMsg('Fail', err.error); });
  }
  ngOnDestroy() {
    if (this.itemSub) { this.itemSub.unsubscribe(); }
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
    if (this.subs3) {
      this.subs3.unsubscribe();
    }
    if (this.subs4) {
      this.subs4.unsubscribe();
    }
    if (this.subs5) {
      this.subs5.unsubscribe();
    }
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
