import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-blog-category-modal',
  templateUrl: './blog-category-modal.component.html',
  styleUrls: ['./blog-category-modal.component.scss'],
  animations: egretAnimations
})
export class BlogCategoryModalComponent implements OnInit {
  rootCategories: any = [];
  categories: any = [];
  addCategoryForm: FormGroup;
  rootCatId: any;
  catId: any;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  constructor(private appear: AppConfirmService,
    private loader: AppLoaderService,
    private api: ApiService,
    private fb: FormBuilder,
    private cdf: ChangeDetectorRef,
    public dialogRef: MatDialogRef<BlogCategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.getCategory();
    this.addCategoryForm = this.fb.group(
      {
        type: ['', Validators.required],
      }
    );
  }
  getCategory() {
    this.loader.open();
    this.sub1 = this.api.blogRootCatFetch({}).subscribe(
      result => {
        this.loader.close();
        this.categories = [];
        this.rootCategories = result;
        this.cdf.detectChanges();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  onAddDetails() {
    this.loader.open();
    this.sub2 = this.api.blogCatSave(this.addCategoryForm.value).subscribe(
      result => {
        this.loader.close();
        this.dialogRef.close();
        this.confirmMsg('Success', 'Details saved successfully');
        this.getCategory();
      }, err => {
        console.log('err', err);
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  changeType(type) {
    if (type === 'root-category') {
      this.addCategoryForm = this.fb.group(
        {
          type: [type, Validators.required],
          name: ['', Validators.required],
        }
      );
    } else if (type === 'category') {
      this.addCategoryForm = this.fb.group(
        {
          type: [type, Validators.required],
          blogrootcat: ['', Validators.required],
          name: ['', Validators.required],
        }
      );
    } 
  }
  getCategories(id) {
    if(id) {
      this.loader.open();
      this.sub3 = this.api.blogCatFetch({blogrootcat: id}).subscribe(
        result => {
          console.log('categories', result);
          this.categories = result;
          this.cdf.detectChanges();
          this.loader.close();
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    }
  }
  deleteCat(val: any){
    console.log('val', val)
    if(this.rootCatId && this.catId) {
      this.sub4 = this.api.blogCatDelete(this.catId).subscribe(
        result => {
          this.getCategory();
          this.dialogRef.close();
          this.confirmMsg('Success', 'Record has been deleted');
          this.cdf.detectChanges();
          this.loader.close();
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    } else if(this.rootCatId) {
      this.sub4 = this.api.blogRootCatDelete(this.rootCatId).subscribe(
        result => {
          this.getCategory();
          this.dialogRef.close();
          this.confirmMsg('Success', 'Record has been deleted');
          this.cdf.detectChanges();
          this.loader.close();
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    }
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
  ngOnDestroy() {
    if(this.sub1) {
      this.sub1.unsubscribe();
    }
    if(this.sub2) {
      this.sub2.unsubscribe();
    }
    if(this.sub3) {
      this.sub3.unsubscribe();
    }
    if(this.sub4) {
      this.sub4.unsubscribe();
    }
  }
}
