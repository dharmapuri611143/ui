import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss'],
  animations: [egretAnimations]
})

export class AssessmentsComponent implements OnInit, OnDestroy {
  user: any;
  // assessList: any;
  assessList: any;
  public getItemSub: Subscription;
  public viewMode: string = 'grid-view';
  constructor( private loader: AppLoaderService,
    private api: ApiService,
    public route: ActivatedRoute,
    private appear: AppConfirmService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.assessList = [];
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user) {
      this.assesslist();
    }
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
  assesslist() {
    this.loader.open();
    this.getItemSub = this.api.fetchAssessmentByUser({userId: this.user._id}).subscribe(res => {
      this.assessList = res;
      this.changeDetectorRef.detectChanges();
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
