import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
// import { MapsAPILoader, MouseEvent } from '@agm/core';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  animations: egretAnimations
})
export class ContactUsComponent implements OnInit {
  getQuoteForm: FormGroup;
  public itemSub: Subscription;
  categories: any = [];
  courses: any = [];
  @Input()
  zoom = 15;
  @Input()
  width: string = '100%';
  @Input()
  height: string = '436px';
  
  @Input()
  latitude = 17.445969;
  @Input()
  longitude = 78.387261;
  @Input()
  latitudePointer = 17.445969;
  @Input()
  longitudePointer = 78.387261;
  @Input()
  opacity = 1;
  @Input()
  showControlsZoom: boolean;
  @Input()
  titleZoomIn = 'Zoom in';
  @Input()
  titleZoomOut = 'Zoom out';
  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    public sanitizer: DomSanitizer,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private appear: AppConfirmService) { }

  ngOnInit() {
    this.getQuoteForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required,
        Validators.maxLength(10),
        Validators.pattern('[0-9]\\d{9}')]],
        category: ['', Validators.required],
        course: ['', Validators.required],
        location: ['', Validators.required],
        message: ['', Validators.required]
      }
    );
    this.getCategory();
  
  }
  increaseZoom() {
    this.zoom++;
  }
  decreaseZoom() {
    this.zoom--;
  }
  onSubmit() {
    this.getQuoteForm.value.status = 'Open';
    this.getQuoteForm.value.type = 'Contact Us';
    this.itemSub = this.api.submitContact(this.getQuoteForm.value).subscribe(res => {
      this.getQuoteForm.reset({});
      this.confirmMsg('Success', 'Thanks for connect Us, Amida will contact you very sortly.');
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }
  getCategory() {
    this.api.getCategory().subscribe(res => {
      console.log('cat', res);
      this.categories = res;
      this.changeDetectorRef.detectChanges();
    }, err => { this.confirmMsg('Fail', err.error); });
  }

  getCourseByCat(name) {
    this.api.getCurrCourse({ name: name }).subscribe(res => {
      this.courses = res;
    }, err => { this.confirmMsg('Fail', err.error); });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }

  ngOnDestroy() {
    if (this.itemSub) {
      this.itemSub.unsubscribe();
    }
  }
}
