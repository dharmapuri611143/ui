import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation, ChangeDetectorRef, HostListener } from '@angular/core';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Observable } from 'rxjs/Observable';
import { MatSidenav } from '@angular/material';
import { CountdownComponent } from 'ngx-countdown';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
  animations: [egretAnimations]
})

export class AssessmentComponent implements OnInit, OnDestroy {
  @HostListener('window:beforeunload', ['$event'])
  public currentQSelected = 1;
  public questionNumber: any;
  public questionMatrix: any;
  public qOptions = [];
  public user: any;
  public assessmentDetail: any;
  public assResult: any;
  public answerMatrix = [];
  public questions = [];
  public qAnswer = '';
  public config = { leftTime: 0, notify: [1], demand: false };
  public showCounter = true;
  public answeredAt = 0;
  public ass_id: any;
  public isSideNavOpen: boolean;
  public currentPage: any;
  public subs1: Subscription;
  public subs2: Subscription;
  public subs3: Subscription;
  @ViewChild(MatSidenav, { static: false }) private sideNav: MatSidenav;

  @ViewChild('cd1', { static: false }) private countdown: CountdownComponent;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private loader: AppLoaderService,
    private api: ApiService,
    private appear: AppConfirmService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user) {
      this.route.queryParams.subscribe(params => {
        this.ass_id = params.id;
        this.getAssessmentById({ _id: params.id }, 1);
      });
    }
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
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away

    return true;
  }

  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = 'This message is displayed to the user in IE and Edge when they navigate without using Angular routing (type another URL/close the browser/etc)';
    }
  }

  getAssessmentById(data, index) {
    this.showCounter = false;
    this.loader.open();
    this.subs1 = this.api.getAssessment(data).subscribe(res => {
      this.assessmentDetail = res;
      this.config.leftTime = res.duration * 60;
      this.questions = res.answers;
      if ((this.assessmentDetail || {}).status !== 'Completed') {
        this.showCounter = true;
      }
      this.changeDetectorRef.detectChanges();
      this.getMatrix();
      this.getQuestion(this.questions[index - 1]);
      setTimeout(() => {
        this.loader.close();
        this.changeDetectorRef.detectChanges();
      }, 300);
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });

  }

  currentQ(qNumber, e) {
    this.currentQSelected = qNumber;
    this.getQuestion(this.questions[this.currentQSelected - 1]);
  }
  previousQ() {
    this.currentQSelected--;
    if (this.currentQSelected > 0 && this.currentQSelected < this.questions.length) {
      this.getQuestion(this.questions[this.currentQSelected - 1]);
    } else {
      this.currentQSelected++;
    }
  }
  nextQ() {
    if (this.currentQSelected > 0 && this.currentQSelected < this.questions.length) {
      this.currentQSelected++;
      this.getQuestion(this.questions[this.currentQSelected - 1]);
    }
  }
  getMatrix() {
    const matrix = [];
    const amatrix = [];
    this.questions.forEach(function (item, index) {
      matrix.push(index + 1);
      amatrix.push(item.ans);
    });
    this.questionMatrix = matrix;
    this.answerMatrix = amatrix;
  }

  getQuestion(data) {
    this.questionNumber = data.question;
    this.qAnswer = data.userAns;
  }
  // tickSelectedQ(index) {
  //     this.questions[this.currentQSelected - 1].options[index] ={}
  // }
  setAnsMatrix(): void {
    for (let index = 0; index < this.answerMatrix.length; index++) {
      if (index === this.currentQSelected - 1) {
        this.answerMatrix[index] = true;
      }
    }
  }

  doneQ(ans: string) {
    if ((this.assessmentDetail || {}).status !== 'Completed') {
      if (ans) {
        this.loader.open(); 
        this.questionNumber.ans = ans;
        this.questionNumber.resultId = this.assessmentDetail._id;
        this.countdown.pause();
        this.countdown.resume();
        this.questionNumber.duration = this.answeredAt / 1000;
        this.subs2 = this.api.saveResult(this.questionNumber).subscribe(res => {
          this.loader.close();
          setTimeout(() => {
            this.getAssessmentById({ _id: this.ass_id }, this.currentQSelected);
          }, 50);
          this.confirmMsg('Success', 'Answer saved');
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
      }
    } else {
      this.confirmMsg('Validation', 'Assessment already completed!!');
    }
  }

  handleEvent(e) {
    if (e.action === 'pause') {
      this.answeredAt = e.left;
    } else if (e.action === 'done' && (this.assessmentDetail || {}).status) {
      this.onComplete();
    }
  }

  // public beforeunloadHandler($event) {
  //   $event.returnValue = "Are you sure?";
  // }
  onComplete() {
    if ((this.assessmentDetail || {}).status !== 'Completed') {
      this.loader.open();
      this.countdown.pause();
      this.subs3 = this.api.complete({ _id: this.assessmentDetail._id, duration: this.answeredAt / 1000 }).subscribe(res => {
        this.confirmMsg('Success', 'Thanks for your participation.');
        setTimeout(() => {
          this.loader.close();
          this.router.navigate(['/student/assesss']);
        }, 2000);
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
    } else {
      this.confirmMsg('Validation', 'Assessment already completed!!');
    }
  }

  toggleSideNav() {
    this.sideNav.opened = !this.sideNav.opened;
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
