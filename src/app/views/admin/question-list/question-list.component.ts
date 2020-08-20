import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../shared/services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService],
  animations: egretAnimations
})
export class QuestionListComponent implements OnInit, OnDestroy {
  public assessmentId: any;
  public questionsList: any;
  public qForm: FormGroup;
  question: any;
  public editorConfig = {
    placeholder: 'Write here question'
  };
  public tools: object = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };
  public subs1: Subscription;
  public subs2: Subscription;
  public subs3: Subscription;
  constructor(private fb: FormBuilder,
    private api: ApiService,
    public sanitizer: DomSanitizer,
    private loader: AppLoaderService,
    public route: ActivatedRoute,
    private appear: AppConfirmService,
    private changeDetectorRef: ChangeDetectorRef) { }


  ngOnInit() {
    this.getQuestionByassessment();
    this.bForm({});
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
  bForm(question) {
    let optionA = '';
    let optionB = '';
    let optionC = '';
    let optionD = '';
    if ((question || {}).options) {
      for (let q of (question || {}).options) {
        if (q.key === 'A') {
          optionA = q.option;
        } else if (q.key === 'B') {
          optionB = q.option;
        } else if (q.key === 'C') {
          optionC = q.option;
        } else if (q.key === 'D') {
          optionD = q.option;
        }
      }
    }

    this.qForm = this.fb.group({
      question: [(question || {}).question || '', Validators.required],
      optionA: [optionA, Validators.required],
      optionB: [optionB, Validators.required],
      optionC: [optionC, Validators.required],
      optionD: [optionD, Validators.required],
      answer: [(question || {}).answer || '', Validators.required],
      comments: [(question || {}).comments || '', Validators.required]
    });
  };
  editQuestion(q) {
    this.bForm(q)
    console.log(q);
    this.question = q;
  }

  onChange(data) {
    // this.equation = data;
  }

  onSaveQuestion() {
    console.log(this.question);
    if (this.question) {
      this.qForm.value._id = this.question._id;
    }
    this.qForm.value.assessmentId = this.assessmentId;
    
    const options = [];
    let optionA = this.qForm.value.optionA;
    if (optionA.indexOf('<p') === 0) {
      optionA = optionA.substring(3);
      optionA = optionA.substring(0, optionA.length - 4);
    }

    let optionB = this.qForm.value.optionB;
    if (optionB.indexOf('<p') === 0) {
      optionB = optionB.substring(3);
      optionB = optionB.substring(0, optionB.length - 4);
    }

    let optionC = this.qForm.value.optionC;
    if (optionC.indexOf('<p') === 0) {
      optionC = optionC.substring(3);
      optionC = optionC.substring(0, optionC.length - 4);
    }

    let optionD = this.qForm.value.optionD;
    if (optionD.indexOf('<p') === 0) {
      optionD = optionD.substring(3);
      optionD = optionD.substring(0, optionD.length - 4);
    }
    console.log(optionA, optionB, optionC, optionD);

    options.push({ key: 'A', option: optionA });
    options.push({ key: 'B', option: optionB });
    options.push({ key: 'C', option: optionC });
    options.push({ key: 'D', option: optionD });
    this.qForm.value.options = options;

    //console.log("data", this.qForm.value);
    this.loader.open();
    this.subs1 = this.api.saveQuestionDetails(this.qForm.value).subscribe(
      result => {
        console.log('result', result);
        this.ngOnInit();
        this.loader.close();
        this.confirmMsg('Success', 'Successfully question details saved');
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }

  getQuestionByassessment() {
    this.route.queryParams.subscribe(params => {
      setTimeout(() => {
        this.loader.open();
      }, 1);
      this.assessmentId = params.id;
      this.subs2 = this.api.getQuestionByAssessment(this.assessmentId).subscribe(res => {
        setTimeout(() => {
          this.loader.close();
        }, 200);
        this.questionsList = res;
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
    });
  }

  deleteQuestion(questionId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.loader.open();
        this.subs3 = this.api.removeQuestion(questionId).subscribe(res => {
          this.loader.close();
          this.confirmMsg('Success', 'Question has been deleted successfully');
          this.getQuestionByassessment();
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
      }
    });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
