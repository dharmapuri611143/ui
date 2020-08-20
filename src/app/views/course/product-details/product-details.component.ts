import { EndPoint } from "./../../../shared/services/server.service";
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { egretAnimations } from "../../../shared/animations/egret-animations";
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { Product } from "../../../shared/models/product.model";
import { Subscription } from "rxjs/Subscription";
import { ApiService } from "../../../shared/services/api.service";
import { DomSanitizer } from "@angular/platform-browser";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { UserService } from "../../../shared/services/user.service";
import { HtmlContentPopupComponent } from "../html-content-popup/html-content-popup.component";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"],
  animations: egretAnimations,
})
export class ProductDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public productID;
  reviews: any = [];
  demoUrl: any;
  public activeCategory: string = "";
  vTitle: string;
  selectedVideo: any;
  videoContent: any;
  apiPath = EndPoint() + "video/?filename=";
  public courseDetails: any;
  public quantity: number = 1;
  rating1Percent1: any;
  rating1Percent2: any;
  rating1Percent3: any;
  rating1Percent4: any;
  rating1Percent5: any;
  private productSub: Subscription;
  userDetail: any;
  cartCount = 0;
  vContentList = [];
  faqList = [];
  relatedCourses: any;
  showAmiBot = true;
  public photoGallery: any[] = [{ url: "", state: "0" }];
  public subs1: Subscription;
  public subs2: Subscription;
  public subs3: Subscription;
  public subs4: Subscription;
  public subs5: Subscription;
  public subs6: Subscription;
  public subs7: Subscription;
  public subs8: Subscription;
  private clientUrl = "";

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private api: ApiService,
    private elRef: ElementRef,
    private loader: AppLoaderService,
    public sanitizer: DomSanitizer,
    private cdf: ChangeDetectorRef,
    private appear: AppConfirmService,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.clientUrl =
      document.location.protocol + "//" + document.location.hostname + ":8080/";
  }

  ngOnInit() {
    this.userDetail = this.userService.user();
    if (!this.productID) {
      this.productID = this.route.snapshot.params["id"];
    }
    this.getProduct();
    if ((this.userDetail || {})._id) {
      this.getCart();
    }
  }
  ngAfterViewInit() {
    this.getDemoVideo();
    this.getVideoContent();
    this.getFaq();
    this.relatedCourse();
  }
  onvideo(e) {
    console.log(e);
  }
  ngOnDestroy() {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
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
    if (this.subs8) {
      this.subs8.unsubscribe();
    }
  }
  run() {}
  getProduct() {
    this.loader.open();
    this.productSub = this.api.getCourseById(this.productID).subscribe(
      (res) => {
        console.log("course: ", res);
        this.courseDetails = res;
        let path = res.image;
        path = path.substr(16);
        this.courseDetails.image = this.clientUrl + path;
        if ((res || {}).htmlcontent) {
          this.courseDetails.htmlcontent = this.clientUrl + res.htmlcontent;
        }
        this.loader.close();
        this.cdf.detectChanges();
        this.getReview(this.productID);
      },
      (err) => {
        this.loader.close();
        this.confirmMsg("Fail", err.error);
      }
    );
  }
  getVideoContent() {
    this.subs1 = this.api.getVideoContent(this.productID).subscribe(
      (res) => {
        console.log("v con", res);
        this.vContentList = res;
        this.addApiLinkToVideo(res);
        this.cdf.detectChanges();
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }
  addApiLinkToVideo(data) {
    this.videoContent = [];
    if (((data || {})[0] || {}).title) {
      this.vTitle = data[0].title;
      data.forEach((element) => {
        const vContent = [];
        if ((element || {}).videoUrl) {
          element.videoUrl.forEach((elm) => {
            if (!elm.vFlag) {


              // elm.path =  `https://drive.google.com/file/d/${elm.path}/preview`;
              elm.path = `${elm.path}`;
            }
            vContent.push(elm);
          });
        }
        //element.videoUrl = vContent;
        //this.videoContent.push(element);
      });
    }
    if ((((this.videoContent || {})[0] || {}).videoUrl || {})[0]) {
      this.selectedVideo = this.videoContent[0].videoUrl[0];
      this.cdf.detectChanges();
      // const player = this.elRef.nativeElement.querySelector("#sub-video");
      // player.load();
      // player.play();
    }
  }
  getFaq() {
    this.subs2 = this.api.getFaq({ course: this.productID }).subscribe(
      (res) => {
        this.faqList = res;
        console.log("this.faqList", this.faqList);
        this.cdf.detectChanges();
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }
  getCart() {
    this.subs3 = this.api.getCartCount().subscribe(
      (res) => {
        console.log("cout", res);
        this.cartCount = res.cartCount;
        this.cdf.detectChanges();
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }
  relatedCourse() {
    this.subs4 = this.api.getRelatedCourse(this.productID).subscribe(
      (res) => {
        console.log("relatedCourses: ", res);

        let dataArray = [];
        for (let item of res) {
          if ((item || {}).image) {
            let path = item.image;
            path = path.substr(16);
            item.image = this.clientUrl + path;
          }

          dataArray.push(item);
        }

        this.relatedCourses = dataArray;
        this.cdf.detectChanges();
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }
  onClickRelatedC(id) {
    this.productID = id;
    this.ngAfterViewInit();
    this.ngOnInit();
  }
  addToCart(id) {
    if ((this.userDetail || {})._id) {
      this.loader.open();
      this.subs5 = this.api.addToCarts([id]).subscribe(
        (cart) => {
          this.loader.close();
          this.getCart();
          this.snackBar.open("Product added to cart", "OK", { duration: 4000 });
        },
        (err) => {
          this.loader.close();
          this.confirmMsg("Fail", err.error);
        }
      );
    } else {
      sessionStorage.setItem("product_back", "ok");
      this.router.navigate(["/sessions/signin"]);
    }
  }
  buyNow() {
    if ((this.userDetail || {})._id) {
      this.loader.open();
      this.subs6 = this.api.addToCarts(this.courseDetails._id).subscribe(
        (cart) => {
          this.loader.close();
          setTimeout(() => {
            this.router.navigate(["/course/cart"]);
          }, 2000);
        },
        (err) => {
          this.loader.close();
          if (err.status === 302) {
            this.router.navigate(["/course/cart"]);
          } else {
            this.confirmMsg("Fail", err.error);
          }
        }
      );
    } else {
      sessionStorage.setItem("product_back", "ok");
      this.router.navigate(["/sessions/signin"]);
    }
  }
  openHtmlCont(htmlUrl): void {
    console.log("htmlUrl", htmlUrl);
    if (!htmlUrl) {
      this.confirmMsg(
        "Validation",
        "Interactive Videos not available for this course."
      );
      return;
    }
    if (!this.courseDetails.htmlFlag) {
      this.confirmMsg(
        "Validation",
        "Please purchase the course for this facility."
      );
      return;
    }
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      HtmlContentPopupComponent,
      {
        // position: {
        //   top: '10px',
        //   right: '10px'
        // },
        height: "98%",
        width: "98%",
        panelClass: "full-screen-modal",
        data: { htmlUrl: htmlUrl },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }
  initGallery(product: Product) {
    if (!product.gallery) {
      return;
    }
    this.photoGallery = product.gallery.map((i) => {
      return {
        url: i,
        state: "0",
      };
    });
    if (this.photoGallery[0]) {
      this.photoGallery[0].state = "1";
    }
  }
  changeState(photo) {
    if (photo.state === "1") {
      return;
    }
    this.photoGallery = this.photoGallery.map((p) => {
      if (photo.url === p.url) {
        setTimeout(() => {
          p.state = "1";
          return p;
        }, 290);
      }
      p.state = "0";
      return p;
    });
  }
  getDemoVideo() {
    this.subs7 = this.api.getDemoVideo(this.productID).subscribe(
      (res) => {
        console.log("video: ", res);
        this.demoUrl = res.path;
        this.cdf.detectChanges();
        console.log(this.demoUrl);
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }

  getReview(id) {
    this.subs8 = this.api.getReview(id).subscribe(
      (res) => {
        let finalArray = [];
        for (let item of res) {
          if (((item || {}).reviwedBy || {}).image) {
            let path = item.reviwedBy.image;
            path = path.substr(16);
            item.reviwedBy.image = this.clientUrl + path;
          }
          finalArray.push(item);
        }
        this.reviews = finalArray;
        this.cdf.detectChanges();
        this.getReviewPercent();

        console.log("reviews", res);
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }
  spdoc(doc) {
    let spdoc = doc.split("/");
    return spdoc[spdoc.length - 1];
  }
  dDocs(dname) {
    if (!(this.courseDetails || {})._id) {
      this.confirmMsg("Fail", "Please select the course");
      return;
    }
    this.loader.open();
    this.subs8 = this.api
      .downloadFile({ _id: this.courseDetails._id, path: dname })
      .subscribe(
        (res) => {
          let splitFname = dname.split("/");
          let aLen = splitFname.length;
          splitFname = splitFname[aLen - 1];
          this.api.saveData(res.base64Data, splitFname);
          this.loader.close();
        },
        (err) => {
          this.loader.close();
          this.confirmMsg("Fail", err.error);
        }
      );
  }

  getReviewPercent() {
    let rating1 = 0;
    let rating2 = 0;
    let rating3 = 0;
    let rating4 = 0;
    let rating5 = 0;
    this.reviews.forEach(function (item) {
      if (item.rating === 1) {
        rating1++;
      } else if (item.rating === 2) {
        rating2++;
      } else if (item.rating === 3) {
        rating3++;
      } else if (item.rating === 4) {
        rating4++;
      } else if (item.rating === 5) {
        rating5++;
      }
    });

    this.rating1Percent1 = (rating1 * 100) / this.reviews.length;
    this.rating1Percent2 = (rating2 * 100) / this.reviews.length;
    this.rating1Percent3 = (rating3 * 100) / this.reviews.length;
    this.rating1Percent4 = (rating4 * 100) / this.reviews.length;
    this.rating1Percent5 = (rating5 * 100) / this.reviews.length;
  }

  openLessonV(videoObj, vTitle, category) {
    this.activeCategory = videoObj.title;
    this.vTitle = vTitle;
    this.selectedVideo = videoObj;
    // const player = this.elRef.nativeElement.querySelector("#sub-video");
    // player.load();
    // player.play();
  }
  confirmMsg(title, msg) {
    this.appear
      .confirm({ title: title, message: msg, button: "close" })
      .subscribe((res) => {});
  }
}
