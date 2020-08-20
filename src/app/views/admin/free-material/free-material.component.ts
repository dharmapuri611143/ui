import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';

@Component({
  selector: 'app-free-material',
  templateUrl: './free-material.component.html',
  styleUrls: ['./free-material.component.scss'],
  animations: egretAnimations
})
export class FreeMaterialComponent implements OnInit, OnDestroy {
  public itemForm: FormGroup;
  public filterForm: FormGroup;
  public getItemSub: Subscription;
  uploadSub1: Subscription;
  uploadSub2: Subscription;
  saveSub: Subscription;
  sub1: Subscription;
  sub2: Subscription;
  _id: string;
  matDetail: any;
  editorData = ``;
  suFiles = [];
  rootCategories: any = [];
  categories: any = [];
  subjects: any = [];
  items = {
    limit: 10,
    skip: 1,
    count: 0,
    offset: 0,
    docs: [],
    page: 1,
    pages: 0,
    total: 0,
  };
  paginatlimit = [5, 10, 25];
  private clientUrl = '';
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private appear: AppConfirmService,
    private loader: AppLoaderService,
    private api: ApiService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      filterQuery: ['']
    });
    this.buildItemForm({});
    this.getCourseList();
  }
  getCourseList() {
    this.loader.open();
    this.sub1 = this.api.freeMatFetch({ skip: this.items.skip, limit: this.items.limit, filterQuery: this.filterForm.value.filterQuery })
      .subscribe(res => {
        this.loader.close();
        let dataArray = [];
        for (let item of res.docs) {
          if ((item || {}).image) {
            let path = item.image;
            path = path.substr(16)
            item.image = this.clientUrl + path;
          }

          dataArray.push(item);
        }
        this.items.docs = dataArray;
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
  searchSubmit() {
    this.getCourseList();
  }
  setPage(pageInfo) {
    this.items.limit = pageInfo.pageSize;
    this.items.skip = pageInfo.pageIndex + 1;
    this.getCourseList();
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      title: [item.title || '', Validators.required],
      summary: [item.summary || '', Validators.required],
      rootCategoryName: [item.rootCategoryName || '', Validators.required],
      categoryName: [item.categoryName || ''],
      subjectName: [item.subjectName || ''],
    });
    if (this.itemForm.value.rootCategoryName) {
      this.showCategories(this.itemForm.value.rootCategoryName);
    }
    if (this.itemForm.value.categoryName) {
      setTimeout(() => {
        this.onCategoryChange(this.itemForm.value.categoryName);
      }, 100);
    }
    this.getCategory();
  }
  getCategory() {
    this.sub2 = this.api.getCategoryDetails().subscribe(
      result => {
        this.rootCategories = result;
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }
  showCategories(rootcname) {
    for (const i in this.rootCategories) {
      if (rootcname && this.rootCategories[i].name === rootcname) {
        this.subjects = [];
        this.categories = this.rootCategories[i].categories;
      } else if (this.rootCategories[i].name === rootcname) {
        this.categories = this.rootCategories[i].categories;
      }
    }
    this.changeDetectorRef.detectChanges();
  }
  onCategoryChange(cname) {
    for (const i in this.categories) {
      if (this.categories[i].name === cname) {
        this.subjects = this.categories[i].subjects;
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  fetchById(id) {
    this._id = id;
    this.getItemSub = this.api.freeMatById({ _id: id }).subscribe(res => {
      this.matDetail = res;
      this.buildItemForm(res);
      this.editorData = res.content;
      this.changeDetectorRef.detectChanges();
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }

  submit() {
    if (!this._id && this.suFiles.length === 0) {
      this.confirmMsg('Validation', 'Please add Image');
      return;
    } else if (this.suFiles.length === 0) {
      this.loader.open();
      this.saveMaterial();
    } else {
      this.loader.open();
      const formData = new FormData();
      formData.append('files', this.suFiles[0]);
      if (this._id) {
        formData.append('_id', this._id);
      }
      if ((this.matDetail || {}).imagePath) {
        formData.append('imagePath', this.matDetail.imagePath);
      }
      this.uploadSub1 = this.api.freeMatImgUp(formData).subscribe(data => {
        this.itemForm.value.image = data.data[0];
        this.saveMaterial();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
    }
  }

  saveMaterial() {
    if (this._id) {
      this.itemForm.value._id = this._id;
    }
    this.itemForm.value.content = this.editorData;
    console.log(this.itemForm.value);
    this.saveSub = this.api.freeMatSave(this.itemForm.value).subscribe(res => {
      this.loader.close();
      this.confirmMsg('Success', 'Course has been updated!');
      this.getCourseList();
      setTimeout(() => {
        this.buildItemForm({});
        this.editorData = ``;
        this.suFiles = [];
        this.changeDetectorRef.detectChanges();
      }, 500);
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  deleteItem() {
    console.log("data", this._id);
    this.loader.open();
    this.uploadSub2 = this.api.freeMatDelete({ _id: this._id })
      .subscribe(data => {
        this.loader.close();
        this.confirmMsg('Success', 'Free Material Deleted!');
        this.getCourseList();
        this._id = '';
        setTimeout(() => {
          this.buildItemForm({});
          this.editorData = ``;
          this.suFiles = [];
          this.changeDetectorRef.detectChanges();
        }, 500);
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.uploadSub1) {
      this.uploadSub1.unsubscribe();
    }
    if (this.uploadSub2) {
      this.uploadSub2.unsubscribe();
    }
    if (this.saveSub) {
      this.saveSub.unsubscribe();
    }
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }
  onContentChanged() {
  }
  onSelectionChanged() {
  }
  onImageChange(event) {
    this.suFiles = event.target.files;
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
