import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { Product } from '../../../shared/models/product.model';
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
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [egretAnimations]
})
export class ProductsComponent implements OnInit, OnDestroy {
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
  userDetail: any;
  cartCh={};
  // ==========================
  public isSideNavOpen: boolean;
  public viewMode: string = 'grid-view';
  public subs1: Subscription;
public subs2: Subscription;
private clientUrl = '';  
selectToCart = [];
  @ViewChild(MatSidenav, { static: false }) private sideNav: MatSidenav;
  public cart: any;
  public cartData: any;
  cartCount = 0;
  sellectAll = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private api: ApiService,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private appear: AppConfirmService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { 
    this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
  }

  ngOnInit() {
    this.userDetail = this.userService.user();
    this.rootCategories$ = this.api.getRootCategories().pipe(
      map(cats => {
        if (((cats || {})[0] || {})._id) {
          this.activeRootCategory = ((cats || {})[0] || {}).name;
          this.getCategory(((cats || {})[0] || {})._id);
        }
        return cats;
      }));
    this.buildFilterForm({
      minPrice: 0,
      maxPrice: 0,
      minRating: 1,
      maxRating: 5,
      limit: this.items.limit,
      skip: this.items.skip
    });
  
    this.route.queryParams.subscribe(params => {
      if ((params || {}).price === '0') {
        this.filterForm.controls['price'].setValue(0);
      } else {
        this.filterForm.controls['price'].setValue('');
      }
      if ((params || {}).filterValue) {
        this.filterForm.controls['filterValue'].setValue(params.filterValue);
      } 
      this.getList();
    });
    if ((this.userDetail || {})._id) {
      this.getCart();
    }
  }

  getList() {
    setTimeout(() => {
      this.loader.open();
    });
    this.products$ = this.api
      .getCourseFilter(this.filterForm.value)
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
            if(item._id) {
              this.cartCh['pro_'+item._id] = false;
            }
            
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
  getCart() {
    this.subs1 = this.api
      .getCartCount()
      .subscribe(res => {
        console.log('cout', res);
        this.cartCount = res.cartCount;
        this.changeDetectorRef.detectChanges();
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
  }

  addToCart(id) {
    if ((this.userDetail || {})._id) {
      this.loader.open();
      this.api
        .addToCarts(id)
        .subscribe(cart => {
          this.loader.close();
          this.getCart();
          this.snackBar.open('Product added to cart', 'OK', { duration: 4000 });
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
    } else {
      sessionStorage.setItem('product_back', 'ok');
      this.router.navigate(['/sessions/signin']);
    }
  }
  
  selectAllCart() {
    let forDelete = this.selectToCart;
    this.products$.subscribe(res=> {
      for(let item of res) {
        if(this.sellectAll) {
          this.selectToCart.push(item._id);
          this.cartCh['pro_'+item._id] = true;
          this.changeDetectorRef.detectChanges();
        } else {
          this.selectToCart = [];
          this.cartCh['pro_'+item._id] = false;
          this.changeDetectorRef.detectChanges();
        }
      }
      if(this.selectToCart.length>0) {
        this.addToCart(this.selectToCart);
        this.getCart();
      } else {
       this.removeProduct(forDelete);
       
      }
    })
  }

  buildFilterForm(filterData: any = {}) {
    this.filterForm = this.fb.group({
      limit: [filterData.limit],
      skip: [filterData.skip],
      filterValue: [''],
      rootCategoryName: [''],
      categoryName: [''],
      price: [''],
      minPrice: [filterData.minPrice],
      maxPrice: [filterData.maxPrice],
      minRating: [filterData.minRating],
      maxRating: [filterData.maxRating]
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
  selectPro(id:string){
    console.log(this.selectToCart)
    if(this.selectToCart.indexOf(id) === -1) {
      console.log('true')
      this.selectToCart.push(id);
      this.cartCh['pro_'+id] = true;
      this.addToCart([id])
    } else {
      console.log('false')
      this.cartCh['pro_'+id] = false;
      this.selectToCart.splice(this.selectToCart.indexOf(id), 1);
      this.removeProduct([id]);
    }
    console.log(this.selectToCart)
  }
  removeProduct(cartItem) {
    this.loader.open();
    this.subs2 = this.api.deleteFromCartList(cartItem)
      .subscribe(res => {
        this.changeDetectorRef.detectChanges();
        this.loader.close();
        this.confirmMsg('Success', 'Product has been removed from cart.');
        this.getCart();
      }, err => {
        this.loader.close();
        this.confirmMsg('Fail', err.error);
      });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
