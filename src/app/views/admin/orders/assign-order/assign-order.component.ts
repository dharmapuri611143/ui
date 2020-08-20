import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, tap, switchMap, finalize, map, startWith } from 'rxjs/operators';
import { ApiService } from 'app/shared/services/api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
@Component({
  selector: 'app-assign-order',
  templateUrl: './assign-order.component.html',
  styleUrls: ['./assign-order.component.scss']
})
export class AssignOrderComponent implements OnInit {
  public assForm: FormGroup;
  fullName = new FormControl();
  rootCategoryName = new FormControl();
  categoryName = new FormControl();
  subjectName = new FormControl();
  courseName = new FormControl();
  public filteredStates$: Observable<any> = null;
  public subs1: Subscription;
  public subs2: Subscription;
  public subs3: Subscription;
  public subs4: Subscription;
  rootCategories: any = [];
  categories: any = [];
  subjects: any = [];
  courses: any = [];
  rootCategory: any;
  category: any;
  subject: any;

  constructor(private appear: AppConfirmService,
    private api: ApiService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssignOrderComponent>,
    private loader: AppLoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdf: ChangeDetectorRef) { }
    lookup(value: any): Observable<any> {
      return this.api.stdAutoComp(value).pipe(
        map(results => results));
    }
  ngOnInit() {
    this.assForm = this.fb.group({
      fullName: ['', Validators.required],
      rootCategoryName: ['', Validators.required],
      categoryName: [''],
      subjectName: [''],
      courseName:  [''],
    });
    this.filteredStates$ = this.assForm.controls['fullName'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value) {
          return this.lookup({ fullName: value });
        } else {
          return this.lookup({});
        }
      })
    );
    this.getCategory();
  }

  assignCourse() {
    this.loader.open();
    this.api.orderManually(this.assForm.value).subscribe(
      result => {
        this.loader.close();
        this.confirmMsg('Success', 'Order has been Created Successfully');
        setTimeout(()=>{
          this.dialogRef.close();
        }, 1000)
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  getCategory() {
     this.api.getCategoryDetails().subscribe(
      result => {
        this.rootCategories = result;
        this.cdf.detectChanges();
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }
  showCategories() {
    for (const i in this.rootCategories) {
      if (this.assForm.value.rootCategoryName && this.rootCategories[i].name === this.assForm.value.rootCategoryName) {
        this.subjects = [];
        this.categories = this.rootCategories[i].categories;
        this.rootCategory = this.rootCategories[i];
      } else if (this.rootCategories[i].name === this.assForm.value.rootCategoryName) {
        this.categories = this.rootCategories[i].categories;
        this.rootCategory = this.rootCategories[i];
      }
    }
    this.cdf.detectChanges();
  }
  onCategoryChange(cname) {
    for (const i in this.categories) {
      if (this.categories[i].name === cname) {
        this.subjects = this.categories[i].subjects;
        this.category = this.categories[i];
      }
    }
    this.cdf.detectChanges();
  }
  onSubjectChange(event) {
    this.subjects.forEach(cat => {
      if (cat.name === event) {
        this.subject = cat;
      }
    });
    this.cdf.detectChanges();
  }
  getCourses(data) {
    this.loader.open();
    this.subs3 = this.api.getCourseByOne(data).subscribe(
      result => {
        this.courses = result;
        this.loader.close();
        this.cdf.detectChanges();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
