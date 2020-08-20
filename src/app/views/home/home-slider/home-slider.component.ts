import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss'],
  animations: egretAnimations
})
export class HomeSliderComponent implements OnInit, OnDestroy, AfterViewInit {
  sliderList = [];
  public itemSub: Subscription;
  private clientUrl = '';

  constructor(public sanitizer: DomSanitizer,
    private api: ApiService,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
  }

  ngOnInit() {
    this.sliderlist();
  }
  ngAfterViewInit(): void {
    // this.sliderlist();
  }
  sliderlist() {
    this.itemSub = this.api.homeSlider()
      .subscribe(data => {
        let homeArray = [];
        for (let item of data) {
          if((item ||{}).image) {
            let path = item.image;
            path = path.substr(16)
            item.image = this.clientUrl + path;
          }
          homeArray.push(item);
        }
        this.sliderList = homeArray;
        jQuery(function ($) {
          let owl = $('.owl-slider');
          owl.owlCarousel({
            margin: 0,
            loop: true,
            rewind: true,
            nav: false,
            touchDrag: true,
            responsive: {
              0: {
                items: 1
              },
              600: {
                items: 1
              },
              1000: {
                items: 1
              }
            }
          });

          $('.customNextBtnhm').click(function () {
            owl.trigger('next.owl.carousel');
          });

          $('.customPrevBtnhm').click(function () {
            owl.trigger('prev.owl.carousel');
          });

        });
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }
  ngOnDestroy() {
    if (this.itemSub) { this.itemSub.unsubscribe(); }

  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
