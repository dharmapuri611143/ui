import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  animations: egretAnimations
})

export class BlogDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  blogDetail: any;
  blogList: any;
  private clientUrl = '';  
  blogId = '';
  reviewForm: FormGroup;
  public itemSub: Subscription;
  public getItemSub: Subscription;
  public sub1: Subscription;
  public sub2: Subscription;
  reviews: any;
  rating: number = 3;
  ratSelected5: string;
  ratSelected4: string;
  ratSelected3: string;
  ratSelected2: string;
  ratSelected1: string;
  review: string;
  ratingArr = [5, 4, 3, 2, 1];
  color: string = 'accent';
  starCount: number = 1;
  userDetail: any;
  @ViewChild('htmlcontent', {static: false}) block: ElementRef;
  constructor(public sanitizer: DomSanitizer,
    private api: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private userService: UserService,
    private appear: AppConfirmService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef) {
      this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
     }
    ngAfterViewInit() {
    }
  ngOnInit() {
    this.userDetail = this.userService.user();
    this.bloglist();
    this.route.queryParams.subscribe(params => {
      this.getBlog(params._id);
      this.blogId = params._id;
      this.getReview();
    });
    this.reviewForm = this.fb.group(
      {
        review: ['', Validators.required]
      }
    );
  }
  getBlog(id) {
    this.loader.open();
    this.blogId = id;
    this.getReview();
    this.itemSub = this.api.blogGetById(id).subscribe(res => {
      let path = res.image;
      path = path.substr(16)
      res.image =  this.clientUrl + path;
      this.blogDetail = res;
      this.block.nativeElement.innerHTML = res.content;
      let classDiv = document.getElementsByClassName('ql-video') as HTMLCollection;
      for(let i=0; i<classDiv.length; i++) {
        let di = classDiv[i] as HTMLElement;
        di.style.width = '532px';
        di.style.height = '300px';
      }
      this.loader.close();
      this.changeDetectorRef.detectChanges();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error.msg);
    });
  }
  bloglist() {
  
   // this.loader.open();
    this.getItemSub = this.api.blogFetch({})
      .subscribe(data => {

        let dataArray = [];
      for(let item of data) {
        let path = item.image;
        path = path.substr(16)
        item.image =  this.clientUrl + path;
        dataArray.push(item);
      }
        this.blogList = dataArray;
        jQuery(function ($) {
          let owl = $('.owl-carousel');
          owl.owlCarousel({
            margin: 5,
            loop: true,
            rewind: true,
            nav: false,
            touchDrag: true,
            responsive: {
              0: {
                items: 1
              },
              600: {
                items: 3
              },
              1000: {
                items: 4
              }
            }
          });
          $('.customNextBtn').click(function () {
            owl.trigger('next.owl.carousel');
          });
          $('.customPrevBtn').click(function () {
            owl.trigger('prev.owl.carousel');
          });
        });
        this.changeDetectorRef.detectChanges();
      }, err => {
       // this.loader.close();
        this.confirmMsg('Fail', err.error.msg);
      });
  }
  ngOnDestroy() {
    if (this.itemSub) { this.itemSub.unsubscribe(); }
    if (this.sub1) { this.sub1.unsubscribe(); }
    if (this.sub2) { this.sub2.unsubscribe(); }
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  createReview() {
    if ((this.userDetail || {})._id) {
    this.loader.open();
    this.reviewForm.value.rating = this.rating;
    this.reviewForm.value.blog = this.blogId;
    this.sub1 = this.api.createbReview(this.reviewForm.value).subscribe(res => {
      this.confirmMsg('Success', 'Your review updated');
      this.loader.close();
      this.clearReview();
      this.getReview();
    }, err => {
      this.clearReview();
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  } else {
    sessionStorage.setItem('product_back', 'ok');
    this.router.navigate(['/sessions/signin']);
  }
  }
  getReview() {
   this.sub2 = this.api.getbReview(this.blogId).subscribe(res => {
      let finalArray = [];
      for(let item of res) {
        if(((item ||{}).reviwedBy ||{}).image) {
          let path = item.reviwedBy.image;
          path = path.substr(16)
          item.reviwedBy.image =  this.clientUrl + path;
        }
        finalArray.push(item);
      }
      this.reviews = finalArray;
      this.changeDetectorRef.detectChanges();
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }
  clearReview() {
    this.review = '';
    this.ratSelected1 = '';
    this.ratSelected2 = '';
    this.ratSelected3 = '';
    this.ratSelected4 = '';
    this.ratSelected5 = '';
  }
  
  onClick(rating: number) {
    this.rating = rating;
    this.changeDetectorRef.detectChanges();
    return false;
  }
  showIcon(index: number) {
    if (this.rating >= index) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}

