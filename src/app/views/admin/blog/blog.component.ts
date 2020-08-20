import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  animations: egretAnimations
})
export class BlogComponent implements OnInit, OnDestroy {
  public itemForm: FormGroup;
  suFiles = [];
  public getItemSub: Subscription;
  uploadSub1: Subscription;
  sub1: Subscription;
  sub2: Subscription;
  saveSub: Subscription;
  _id: string;
  blogDetail: any;

  editorData = ``;
  rootCategories: any = [];
  categories: any = [];
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private appear: AppConfirmService,
    private loader: AppLoaderService,
    private api: ApiService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.buildItemForm({});
    this.route.params.subscribe(params => {
      this._id = params['id'];
      if (this._id) {
        this.fetchById();
      } else {
        this.buildItemForm({});
      }
    });
    this.getCategory();
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.uploadSub1) {
      this.uploadSub1.unsubscribe();
    }
    if (this.saveSub) {
      this.saveSub.unsubscribe();
    }
    if(this.sub1) {
      this.sub1.unsubscribe();
    }
    if(this.sub2) {
      this.sub2.unsubscribe();
    }
  }
  fetchById() {
    this.getItemSub = this.api.blogGetById(this._id).subscribe(res => {
      this.blogDetail = res;
      this.buildItemForm(res);
      this.editorData = res.content;
      this.getCategory();
      this.changeDetectorRef.detectChanges();
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      title: [item.title || '', Validators.required],
      summary: [item.summary || '', Validators.required],
      category: [item.category || ''],
      rootCategory: [item.rootCategory || '', Validators.required]
    });
  }
  getCategory() {
   this.sub1 = this.api.blogRootCatFetch({}).subscribe(
      result => {
        this.categories = [];
        this.rootCategories = result;
        if(this._id) {
          for(let rc of this.rootCategories) {
            if(this.itemForm.value.rootCategory === rc.name) {
              this.itemForm.controls.rootCategory.setValue(rc._id);
              this.getCategories(rc._id);
            }
          }
        }
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }
  getCategories(id) {
    if(id) {
      this.loader.open();
     this.sub2 = this.api.blogCatFetch({blogrootcat: id}).subscribe(
        result => {
          console.log('categories', result);
          this.categories = result;
          this.changeDetectorRef.detectChanges();
          this.loader.close();
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    }
  }
  onImageChange(event) {
    this.suFiles = event.target.files;
  }
  submit() {
    if (!this._id && this.suFiles.length === 0) {
      this.confirmMsg('Validation', 'Please add Image');
      return;
    } else if (this.suFiles.length === 0) {
      this.loader.open();
      this.saveBlog();
    } else {
      this.loader.open();
      const formData = new FormData();
      formData.append('files', this.suFiles[0]);
      if (this._id) {
        formData.append('_id', this._id);
      }
      if ((this.blogDetail || {}).imagePath) {
        formData.append('imagePath', this.blogDetail.imagePath);
      }
      this.uploadSub1 = this.api.blogUpImage(formData).subscribe(data => {
        this.itemForm.value.image = data.data[0];
        this.saveBlog();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
    }
  }
  saveBlog() {
    console.log('this.itemForm.value', this.itemForm.value);
    if (this._id) {
      this.itemForm.value._id = this._id;
    }
    for(let rc of this.rootCategories) {
      if(rc._id === this.itemForm.value.rootCategory) {
        this.itemForm.value.rootCategory = rc.name;
      }
    }
    this.itemForm.value.content = this.editorData;
    this.saveSub = this.api.blogAdd(this.itemForm.value).subscribe(res => {
      this.loader.close();
      this.changeDetectorRef.detectChanges();
      this.confirmMsg('Success', 'Blog has been updated!');
      setTimeout(() => {
        this.router.navigate(['/admin/bloglist']);
      }, 500);
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
  }

  onContentChanged(e) {
  }
  onSelectionChanged(e) {
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
