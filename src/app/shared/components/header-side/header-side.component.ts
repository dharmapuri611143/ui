import { Component, OnInit,ChangeDetectorRef, EventEmitter, Input, Output, Renderer2, ViewChild, ElementRef, ViewRef } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { UserService } from '../../services/user.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.template.html'
})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel;
  cartCount = 0;
  public availableLangs = [{
    name: 'EN',
    code: 'en',
    flag: 'flag-icon-us'
  }, {
    name: 'ES',
    code: 'es',
    flag: 'flag-icon-es'
  }]
  private clientUrl = '';  
  currentLang = this.availableLangs[0];
  profilePic = '';
  public egretThemes;
  noti: any;
  public layoutConf: any;
  user: any;
  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    public translate: TranslateService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer,
    public userService: UserService,
    public api: ApiService,
    private cdf: ChangeDetectorRef,
  ) {
    this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
  }
  ngOnInit() {
    this.userService.logoutEvent.subscribe(res => {
      this.initCom();
    });
    this.initCom();
    this.api.notifyEvent.subscribe(res=>{
      this.initCom();
    });
  }
  initCom() {
    try{
      this.egretThemes = this.themeService.egretThemes;
      this.layoutConf = this.layout.layoutConf;
      this.translate.use(this.currentLang.code);
      this.user = this.userService.user();
      if((this.user ||{}).image) {
        let path = this.user.image;
        path = path.substr(16)
        this.user.image =  this.clientUrl + path;
      }
     
      if ((this.user ||{})._id) {
        this.api.myNotiC({to: this.user._id}).subscribe(res => {
          this.noti = res;
          this.cdf.detectChanges();
        });
      }
      this.cdf.detectChanges();
    } catch(err) {
      console.log('header', err);
    }
  
  }
  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
  }
  changeTheme(theme) {
    // this.themeService.changeTheme(theme);
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if(this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
        sidebarCompactToggle: true
      })
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed',
      sidebarCompactToggle: true
    })
  }

  toggleCollapse() {
    // compact --> full
    if(this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
        sidebarCompactToggle: false
      }, {transitionClass: true})
    }

    // * --> compact
    this.layout.publishLayoutChange({
      sidebarStyle: 'compact',
      sidebarCompactToggle: true
    }, {transitionClass: true})

  }

  onSearch(e) {
    //   console.log(e)
  }
}