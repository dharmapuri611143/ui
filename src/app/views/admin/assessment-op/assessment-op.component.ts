
import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../shared/services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-assessment-op',
  templateUrl: './assessment-op.component.html',
  styleUrls: ['./assessment-op.component.scss'],
  animations: egretAnimations
})
export class AssessmentOpComponent implements OnInit, OnDestroy {
  public filterForm: FormGroup;
  public assForm: FormGroup;
  assAssForm: FormGroup;
  items = {
    limit: 20,
    skip: 1,
    count: 0,
    offset: 0,
    docs: [],
    page: 1,
    pages: 0,
    total: 0,
  };
  paginatlimit = [5, 10, 25];
  asmtData: any;
  courses: any;
  public rootCategories: any;
  public categories: any;
  public subjects: any;
  assessments: any = [];
  public subs1: Subscription;
  public subs2: Subscription;
  public subs3: Subscription;
  public subs5: Subscription;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public sanitizer: DomSanitizer,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      filterQuery: ['']
    });
    this.assAssForm = this.fb.group({
      rootCategory: [''],
      category: [''],
      subject: [''],
      _id: ['', [Validators.required]],
      type: ['Quiz'], 
      status: ['published']
    });
    this.bForm();
    this.getRootCategories();
    this.getAssessments();
    this.getAssessment();
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
    if (this.subs5) {
      this.subs5.unsubscribe();
    }
  }
  searchSubmit() {
    this.getAssessments();
  }
  addAssessment() {
    this.asmtData = {};
    this.bForm();
  }
  setPage(pageInfo) {
    console.log(pageInfo);
    this.items.limit = pageInfo.pageSize;
    this.items.skip = pageInfo.pageIndex + 1;
    this.getAssessments();
  }
  bForm() {
    this.assForm = this.fb.group({
      name: [(this.asmtData || {}).name || '', Validators.required],
      type: [(this.asmtData || {}).type || '', Validators.required],
      rootCategory: [(this.asmtData || {}).rootCategory || '', Validators.required],
      category: [(this.asmtData || {}).category || '', Validators.required],
      subject: [(this.asmtData || {}).subject || '', Validators.required],
      courseId: [(this.asmtData || {}).courseId || '', Validators.required],
      duration: [(this.asmtData || {}).duration || '', Validators.required],
      startDate: [(this.asmtData || {}).startDate ? (this.asmtData || {}).startDate.split('T')[0] : '', Validators.required],
      endDate: [(this.asmtData || {}).endDate ? (this.asmtData || {}).endDate.split('T')[0] : '', Validators.required],
      description: [(this.asmtData || {}).description || '', Validators.required],
      instructions: [(this.asmtData || {}).instructions || '', Validators.required],
    });
    if (this.assForm.value.rootCategory) {
      this.onRootCategoryChange(this.assForm.value.rootCategory);
    }
    if (this.assForm.value.category) {
      this.onCategoryChange(this.assForm.value.category);
    }
    if (this.assForm.value.subject) {
      this.getCourses({ subjectName: this.assForm.value.subject });
    }
  };
  showAsmt(item) {
    console.log('item', item);
    this.asmtData = item;
    this.bForm();
  }
  getRootCategories() {
    this.subs1 = this.api.getCategoryDetails().subscribe(
      result => {
        this.rootCategories = result;
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }

  onRootCategoryChange(rootcname) {
    for (const i in this.rootCategories) {
      if (rootcname && this.rootCategories[i].name === rootcname) {
        this.subjects = [];
        this.categories = this.rootCategories[i].categories;
      } else if (this.rootCategories[i].name === rootcname) {
        this.categories = this.rootCategories[i].categories;
      }
    }
  }

  onCategoryChange(cname) {
    for (const i in this.categories) {
      if (this.categories[i].name === cname) {
        this.subjects = this.categories[i].subjects;
        console.log("subjects", this.subjects);
      }
    }
  }
  onType(type) {
    if (type === 'Course') {
      this.assForm.get('rootCategory').setValidators([Validators.required]);
      this.assForm.get('rootCategory').updateValueAndValidity();
      this.assForm.get('category').setValidators([Validators.required]);
      this.assForm.get('category').updateValueAndValidity();
      this.assForm.get('subject').setValidators([Validators.required]);
      this.assForm.get('subject').updateValueAndValidity();
      this.assForm.get('courseId').setValidators([Validators.required]);
      this.assForm.get('courseId').updateValueAndValidity();
    } else {
      this.assForm.get('rootCategory').clearValidators();
      this.assForm.get('rootCategory').updateValueAndValidity();
      this.assForm.get('category').clearValidators();
      this.assForm.get('category').updateValueAndValidity();
      this.assForm.get('subject').clearValidators();
      this.assForm.get('subject').updateValueAndValidity();
      this.assForm.get('courseId').clearValidators();
      this.assForm.get('courseId').updateValueAndValidity();

    }
  }
  getAssessments() {
    this.loader.open();
    this.subs2 = this.api.asmtList({ skip: this.items.skip, limit: this.items.limit, filterQuery: this.filterForm.value.filterQuery }).subscribe(
      res => {
        this.loader.close();
        this.items.docs = res.docs;
        this.items.limit = res.limit;
        this.items.page = res.page;
        this.items.pages = res.pages;
        this.items.total = res.total;
        this.items.offset = res.page - 1;
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }

  onSaveDetails() {
    this.loader.open();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!(this.asmtData || {})._id) {
      this.assForm.value.createdBy = user._id;
    } else {
      this.assForm.value._id = (this.asmtData || {})._id;
      this.assForm.value.modifiedBy = user._id;
    }
    if (this.assForm.value.courseId === '') {
      delete this.assForm.value.courseId;
    }
    this.subs3 = this.api.saveAssessmentDetails(this.assForm.value).subscribe(
      result => {
        console.log('result', result);
        this.loader.close();
        setTimeout(() => {
          this.getAssessments();
        }, 400);
        this.confirmMsg('Success', 'Details saved successfully');
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }

  getCourses(data) {
    this.loader.open();
    this.subs3 = this.api.getCourseByOne(data).subscribe(
      result => {
        this.courses = result;
        this.loader.close();
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  pulishAsmt(body) {
    if (body.type === 'Quiz') {
      this.loader.open();
      body.status = 'published';
      this.subs5 = this.api.saveAssessmentDetails(body).subscribe(
        result => {
          this.loader.close();
          this.getAssessments();
          this.changeDetectorRef.detectChanges();
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    } else {
      this.loader.open();
      this.subs5 = this.api.assPublish(body).subscribe(
        result => {
          this.loader.close();
          this.getAssessments();
          this.changeDetectorRef.detectChanges();
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    }

  }
  getAssessment() {
    this.subs2 = this.api.getAsmt(this.assAssForm.value).subscribe(
      result => {
        this.assessments = result;
        console.log('result', result);
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }
  sendAssessment() {
    console.log('this.assAssForm', this.assAssForm.value)
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
