import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../shared/services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-category-op',
  templateUrl: './category-op.component.html',
  styleUrls: ['./category-op.component.scss'],
  animations: egretAnimations
})
export class CategoryOpComponent implements OnInit, OnDestroy {
  position = 'top-right';
  public data: any = [];
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  public visible = false;
  public visibleAnimate = false;
  public rootCategories = [];
  public categories = [];
  public subjects = [];
  public rootCategory = '';
  public rootCategoryValue = '';
  public category = '';
  public categoryValue = '';
  public subject = '';
  public type = '';
  courses = [];
  public loading = false;
  public uploadData = {
    name: '',
    _id: '',
    code: '',
    rootCategoryId: ''
  };
  public selectedImage: File;
  addCategoryForm: FormGroup;
  // @ViewChild('addCategory') public addCategoryModal: any;
  // @ViewChild('addCategoryImage') public addCategoryImageModal: any;
  public subs1: Subscription;
public subs2: Subscription;
public subs3: Subscription;
public subs4: Subscription;
public subs5: Subscription;
public subs6: Subscription;
public subs7: Subscription;
public subs8: Subscription;
public subs9: Subscription;
public subs10: Subscription;
  constructor(private api: ApiService,
    public sanitizer: DomSanitizer,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    private fb: FormBuilder,
    public userService: UserService,
    private cdf: ChangeDetectorRef) { }
  ngOnInit() {
    this.getCategory();
    this.addCategoryForm = this.fb.group(
      {
        type: ['', Validators.required],
      }
    );
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
    if (this.subs8) {
      this.subs8.unsubscribe();
    }
    if (this.subs9) {
      this.subs9.unsubscribe();
    }
    if (this.subs10) {
      this.subs10.unsubscribe();
    }
  }
  getCategory() {
    this.loader.open();
    this.subs1 = this.api.getCategoryDetails().subscribe(
      result => {
        this.loader.close();
        // console.log('result', result);
        this.subjects = [];
        this.categories = [];
        this.rootCategories = result;
        this.cdf.detectChanges();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }

  getCategories(data) {
    this.loader.open();
    let id = data.rootCategoryId.toString();
    this.subs2 = this.api.getCategories(id).subscribe(
      result => {
        this.categories = result;
        this.cdf.detectChanges();
        this.loader.close();
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
        this.cdf.detectChanges();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  removeCourse(data) {
    if (confirm('Are you sure to delete course?')) {
      this.loader.open();
      this.subs4 = this.api.removeCourse(data).subscribe(res => {
          this.loader.close();
          this.cdf.detectChanges();
          this.getCourses({subjectName: data.subjectName});
          this.confirmMsg('Success', 'Course removed succesfully');
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    }
  }
  getSubjects(data) {
    this.loader.open();
    let id = data.categoryId.toString();
    this.subs5 = this.api.getSubjects(id).subscribe(
      result => {
        this.loader.close();
        this.subjects = result;
        this.cdf.detectChanges();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  changeType(type) {
    if (type === 'root-category') {
      this.addCategoryForm = this.fb.group(
        {
          type: [type, Validators.required],
          rootCategory: ['', Validators.required],
        }
      );
    } else if (type === 'category') {
      this.addCategoryForm = this.fb.group(
        {
          type: [type, Validators.required],
          rootCategoryValue: ['', Validators.required],
          category: ['', Validators.required],
          file: [''],
        }
      );
    } else if (type === 'subject') {
      this.addCategoryForm = this.fb.group(
        {
          type: [type, Validators.required],
          rootCategoryValue: ['', Validators.required],
          categoryValue: ['', Validators.required],
          subject: ['', Validators.required],
        }
      );
    }
  }
  showCategories(rootId) {
    console.log('rootCategory', rootId)
    for (const i in this.rootCategories) {
      if (rootId && this.rootCategories[i].id === rootId) {
        this.subjects = [];
        this.categories = this.rootCategories[i].categories;
        console.log("categories", this.categories);
      } else if (this.rootCategories[i].id === rootId) {
        this.categories = this.rootCategories[i].categories;
      }
    }
  }

  showSubjects(category) {
    console.log('cat', category)
    for (const i in this.categories) {
      if (this.categories[i]._id === category._id) {
        this.subjects = this.categories[i].subjects;
        console.log("subjects", this.subjects);
      }
    }
  }

  onAddDetails() {
    if (this.addCategoryForm.value.type === 'category') {
      if (this.selectedImage && this.selectedImage.name) {

      } else {
        this.confirmMsg('Validation', 'Please upload image.');
        return;
      }
    }
    this.loader.open();
    this.subs6 = this.api.saveCategoryDetails(this.addCategoryForm.value).subscribe(
      result => {
        // console.log('result', result);
        this.loader.close();
        if (this.addCategoryForm.value.type === 'category') {
          if (this.selectedImage && this.selectedImage.name) {
            this.onAddImageDetails(result);
          }
        }
        this.confirmMsg('Success', 'Details saved successfully');
        this.getCategory();
      }, err => {
        console.log('err', err);
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }

  removeSubject(data) {
    this.loader.open();
    let id = data._id.toString();
    if (confirm('Are you sure to want to delete subject?')) {
      this.subs7 = this.api.removeSubject(id).subscribe(
        result => {
          // console.log('result', result);
          this.loader.close();
          this.confirmMsg('Success', 'Subject Details removed successfully');
          this.getCategory();
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    }
  }

  removeCategory(data) {
    let id = data._id.toString();
    console.log(data);
    if (confirm('Are you sure to want to delete category?')) {
      this.subs8 = this.api.removeCategory(id).subscribe(
        result => {
          this.confirmMsg('Success', 'Category Details removed successfully');
          // this.getCategories(data);
          this.getCategory();
        }, err => {
          this.confirmMsg('Fail', err.error);
        });
    }
  }

  removeRootCategory(data) {
    // this.loader.open();
    data = data.toString();
    if (confirm('Are you sure to want to delete root category?')) {
      this.subs9 = this.api.removeRootCategory(data).subscribe(
        result => {
          // this.loader.close();
          this.confirmMsg('Success', 'Root category Details removed successfully');
          this.getCategory();
        }, err => {
          // this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    }
  }

  onImageChange(event) {
    console.log(event.target.files);
    this.selectedImage = event.target.files[0];
  }
  openUploadModal(item) {

  }
  onAddImageDetails(data) {
    const formData = new FormData();
    formData.append('categoryId', data._id);
    console.log(this.selectedImage);
    if (this.selectedImage && this.selectedImage.name) {
      formData.append('imageFile', this.selectedImage, this.selectedImage.name);
      this.subs10 = this.api.uploadCategoryImage(formData).subscribe(
        result => {
          this.confirmMsg('Success', 'Successfully uploaded image details');
        }, err => {
          this.confirmMsg('Fail', err.error);
        });
    } else {
      this.confirmMsg('Validation', 'Select image to upload');
    }
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
