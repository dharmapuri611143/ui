import { DOCUMENT } from '@angular/common';
import { EndPoint } from './../../../shared/services/server.service';
import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef,
  Input, Output, EventEmitter, ViewEncapsulation
} from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { MatSidenav, MatDialog, MatDialogRef } from '@angular/material';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Inject } from '@angular/core';
import { HtmlContentPopupComponent } from 'app/views/course/html-content-popup/html-content-popup.component';
@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss'],
  animations: [egretAnimations],
  encapsulation: ViewEncapsulation.Emulated
})
export class MyOrderComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav, { static: false }) private sideNav: MatSidenav;
  public activeCategory: string = '';
  public subs1: Subscription;
  public subs2: Subscription;
  public subs3: Subscription;
  public subs4: Subscription;
  public subs5: Subscription;
  public subs6: Subscription;
  public subs7: Subscription;
  videoList: any;
  ratSelected5: string;
  ratSelected4: string;
  ratSelected3: string;
  ratSelected2: string;
  ratSelected1: string;
  review: string;
  courseId: string;
  reviews: any;
  courseDetails: any;
  faqList: any;
  orderId: string;
  hclflag = false;
  // ========================== view course details
  relatedCourses: any;
  video_count = 0;
  apiPath = EndPoint() + 'video/?filename=';
  videoContent: any;
  selectedVideo: any;
  vTitle: string;
  vSearch: string;
  faqForm: FormGroup;
  reviewForm: FormGroup;
  // rating

  rating: number = 3;
  starCount: number = 1;
  color: string = 'accent';
  ratingArr = [5, 4, 3, 2, 1];
  hcl = ''; // html content link
  private clientUrl = '';  

  constructor(
    private loader: AppLoaderService,
    @Inject(DOCUMENT) private document: Document,
    private api: ApiService,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private elRef: ElementRef,
    private fb: FormBuilder,
    private appear: AppConfirmService,
    public dialog: MatDialog,
    private cdf: ChangeDetectorRef) { 
      this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
    }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.courseId = params.id;
      this.orderId = params.orderId;
      this.getReview();
      this.getCourseById(params);
      this.relatedCourse(params.id);
      this.getVideoContent(params.id);
      this.getFaq();
    });
    this.buildForm();
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
    if (this.subs4) {
      this.subs4.unsubscribe();
    }
    if (this.subs5) {
      this.subs5.unsubscribe();
    }
    if (this.subs6) {
      this.subs6.unsubscribe();
    }
    if (this.subs7) {
      this.subs7.unsubscribe();
    }
  }
  buildForm() {
    this.faqForm = this.fb.group(
      {
        heading: ['', Validators.required],
        content: ['', Validators.required]
      }
    );
    this.reviewForm = this.fb.group(
      {
        review: ['', Validators.required]
      }
    );
  }
  relatedCourse(id) {
    this.subs1 = this.api.getRelatedCourse(id).subscribe(res => {
      let dataArray = [];
      for(let item of res) {
        let path = item.image;
        path = path.substr(16)
        item.image =  this.clientUrl + path;
        dataArray.push(item);
      }
      this.relatedCourses = dataArray;
      this.cdf.detectChanges();
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }
  getVideoContent(id) {
    this.subs2 = this.api.getVideoContent(id).subscribe(res => {
      console.log('v con', res);
      this.addApiLinkToVideo(res);
      this.cdf.detectChanges();
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }

  run() {
    // const el = document.getElementById('nextButton');
    // if (el.addEventListener) {
    //     el.addEventListener('click', this.yourNextFunction, false);
    // } else {
    //     el.attachEvent('onclick', this.yourNextFunction);
    // }
  }

  yourNextFunction() {
    // this.video_count++;
    //     this.videoPlayer.src = this.videoList[this.video_count].v;
    //     this.videoPlayer.type = this.videoList[this.video_count].type;
    //     this.videoPlayer.play();
  }
  spdoc(doc){
    let spdoc = doc.split('/');
    return spdoc[spdoc.length-1];
  }
  dDocs(dname) {
    if (!(this.courseDetails || {})._id) {
      this.confirmMsg('Fail', 'Please select the course');
      return;
    }
    this.loader.open();
    this.api.downloadFile({ _id: this.courseDetails._id, path: dname }).subscribe(res => {
      let splitFname = dname.split('/');
      let aLen = splitFname.length;
      splitFname = splitFname[aLen - 1];
      this.api.saveData(res.base64Data, splitFname);
      this.loader.close();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  openLessonV(videoObj, vTitle, category) {
    this.activeCategory = videoObj.title;
    this.vTitle = vTitle;
    let path = `https://drive.google.com/uc?export=download&id=${videoObj.path}`;
    videoObj.path = path;
    this.selectedVideo = videoObj;
    this.cdf.detectChanges();
    // const player = this.elRef.nativeElement.querySelector('#sub-video');
    // player.load();
    // player.play();
  }
  addApiLinkToVideo(data) {
    this.videoContent = [];
    if (((data || {})[0] || {}).title) {
      this.vTitle = data[0].title;
      data.forEach(element => {
        const vContent = [];
        if ((element || {}).videoUrl) {
          element.videoUrl.forEach(elm => {
            elm.path = this.apiPath + elm.path;
            vContent.push(elm);
          });
        }
        element.videoUrl = vContent;
        this.videoContent.push(element);
      });
    }
    if ((((this.videoContent || {})[0] || {}).videoUrl || {})[0]) {
      this.selectedVideo = this.videoContent[0].videoUrl[0];
    }
    this.cdf.detectChanges();
  }

  onClick(rating: number) {
    this.rating = rating;
    this.cdf.detectChanges();
    return false;
  }
  showIcon(index: number) {
    if (this.rating >= index) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  createReview() {
    this.loader.open();
    this.reviewForm.value.rating = this.rating;
    this.reviewForm.value.course = this.courseId;
    this.subs3 = this.api.createReview(this.reviewForm.value).subscribe(res => {
      this.confirmMsg('Success', 'Your review updated');
      this.loader.close();
      this.clearReview();
      this.getReview();
    }, err => {
      this.clearReview();
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  getReview() {
    this.subs4 = this.api.getReview(this.courseId).subscribe(res => {
      this.reviews = res;
      this.cdf.detectChanges();
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

  getCourseById(params) {
    this.loader.open();
    console.log('parmas: ', params);
    this.subs5 = this.api.getPurchasedCourse(params).subscribe(res => {
      this.courseDetails = res;
      let path = res.image;
      path = path.substr(16)
      this.courseDetails.image =  this.clientUrl + path;
      if((res ||{}).htmlcontent) {
        this.courseDetails.htmlcontent = this.clientUrl + res.htmlcontent;
      }
     
      this.loader.close();
      this.getReview();
      this.cdf.detectChanges();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  createFaq() {
    this.loader.open();
    this.faqForm.value.course = this.courseId;
    this.subs6 = this.api.createFaq(this.faqForm.value).subscribe(res => {
      this.loader.close();
      this.getFaq();
      this.confirmMsg('Success', 'Successfully created');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  getFaq() {
    this.subs7 = this.api.getFaq({ course: this.courseId }).subscribe(res => {
      this.faqList = res;
      console.log('this.faqList', this.faqList);
      this.cdf.detectChanges();
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
  toggleSideNav() {
    this.sideNav.opened = !this.sideNav.opened;
  }
  openHtmlCont(): void {
    if(!this.courseDetails.htmlcontent) {
      this.confirmMsg('Validation', "Interactive Videos not available for this course.");
      return;
    }
    const dialogRef: MatDialogRef<any> =this.dialog.open(HtmlContentPopupComponent, {
      // position: {
      //   top: '10px',
      //   right: '10px'
      // },
      height: '98%',
      width: '98%',
      panelClass: 'full-screen-modal',
      data: {htmlUrl: this.courseDetails.htmlcontent}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}


export enum StarRatingColor {
  primary = 'primary',
  accent = 'accent',
  warn = 'warn'
}