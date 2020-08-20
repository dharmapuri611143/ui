import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-free-c-material',
  templateUrl: './free-c-material.component.html',
  styleUrls: ['./free-c-material.component.scss'],
  animations: [egretAnimations]
})
export class FreeCMaterialComponent implements OnInit, OnDestroy  {
  rootCategories$: Observable<any>;
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
  public products$: Observable<any>;
  public categories$: Observable<any>;
  public activeCategory: string = 'all';
  public activeRootCategory: string = 'all';
  public filterForm: FormGroup;
  // ==========================
  public isSideNavOpen: boolean;
  public viewMode: string = 'grid-view';
  public subs1: Subscription;
public subs2: Subscription;
private clientUrl = '';
  @ViewChild(MatSidenav, { static: false }) private sideNav: MatSidenav;
  constructor(
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private api: ApiService,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private appear: AppConfirmService,
  ) { 
    this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
  }

  ngOnInit() {
    this.rootCategories$ = this.api.getRootCategories().pipe(
      map(cats => {
        if (((cats || {})[0] || {})._id) {
          this.activeRootCategory = ((cats || {})[0] || {}).name;
          this.getCategory(((cats || {})[0] || {})._id);
        }
        return cats;
      }));
    this.buildFilterForm({
      limit: this.items.limit,
      skip: this.items.skip
    });
    this.getList();
  }

  getList() {
    setTimeout(() => {
      this.loader.open();
    });
    this.products$ = this.api
      .freeMatFetch(this.filterForm.value)
      .pipe(
        map(products => {
          this.loader.close();
          this.items.limit = products.limit;
          this.items.page = products.page;
          this.items.pages = products.pages;
          this.items.total = products.total;
          this.items.offset = products.page - 1;
          let dataArray = [];
          for(let item of products.docs) {
            let path = item.image;
            path = path.substr(16)
            item.image =  this.clientUrl + path;
            dataArray.push(item);
          }
          return dataArray;
        })
      );
  }
  getCategory(id) {
    this.categories$ = this.api.getCategoryByOne({ rootCategoryId: id });
  }
  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
   if (this.subs2) {
      this.subs2.unsubscribe();
    }
  }

  buildFilterForm(filterData: any = {}) {
    this.filterForm = this.fb.group({
      limit: [filterData.limit],
      skip: [filterData.skip],
      filterValue: [''],
      rootCategoryName: [''],
      categoryName: [''],
    })
  }
  setActiveMainCategory(category, rootId) {
    this.activeCategory = '';
    this.filterForm.controls['categoryName'].setValue('');
    this.getCategory(rootId);
    this.activeRootCategory = category;
    this.filterForm.controls['rootCategoryName'].setValue(category);
    this.getList();
  }
  setActiveCategory(category) {
    this.activeCategory = category;
    this.filterForm.controls['categoryName'].setValue(category);
    this.getList();
  }

  toggleSideNav() {
    this.sideNav.opened = !this.sideNav.opened;
  }
  setPage(pageInfo) {
    console.log(pageInfo);
    this.items.limit = pageInfo.pageSize;
    this.items.skip = pageInfo.pageIndex + 1;
    this.getList();
  }
  searchSubmit() {
    this.getList();
  }

  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
