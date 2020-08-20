import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-send-inquiry',
  templateUrl: './send-inquiry.component.html',
  styleUrls: ['./send-inquiry.component.scss'],
  animations: egretAnimations
})
export class SendInquiryComponent implements OnInit, OnDestroy {
  getQuoteForm: FormGroup;
  public itemSub: Subscription;
  public subs1: Subscription;
  public subs2: Subscription;
  categories: any = [];
  courses: any = [];
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

  onSubmit() {
    this.loader.open();
    this.getQuoteForm.value.status = 'Open';
    this.getQuoteForm.value.type = 'Inquiry';
    this.itemSub = this.api.submitContact(this.getQuoteForm.value).subscribe(res => {
      this.getQuoteForm.reset({});
      this.loader.close();
      this.confirmMsg('Success', 'Thanks for your Inquiry, Amida will contact you very sortly.');
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }
  getCategory() {
    this.subs1 = this.api.getCategory().subscribe(res => {
      this.categories = res;
      this.changeDetectorRef.detectChanges();
    }, err => { this.confirmMsg('Fail', err.error); });
  }

  getCourseByCat(name) {
    this.subs2 = this.api.getCurrCourse({ name: name }).subscribe(res => {
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
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
  }
}
