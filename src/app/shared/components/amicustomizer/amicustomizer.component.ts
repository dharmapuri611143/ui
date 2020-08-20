import { Component, OnInit, ViewChild, ViewChildren, Input, Renderer2, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavigationService } from '../../../shared/services/navigation.service';
import { LayoutService } from '../../../shared/services/layout.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { CustomizerService } from 'app/shared/services/customizer.service';
import { ThemeService, ITheme } from 'app/shared/services/theme.service';
import { egretAnimations } from '../../animations/egret-animations';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../shared/services/api.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPoint } from '../../services/server.service';
import Swal from 'sweetalert2';
import { ChatService } from '../../../views/app-chats/chat.service';


@Component({
  selector: 'app-amicustomizer',
  templateUrl: './amicustomizer.component.html',
  styleUrls: ['./amicustomizer.component.scss'],
  animations: [egretAnimations],
  providers: [ChatService]
})
export class AmicustomizerComponent implements OnInit {

  isCustomizerOpen: boolean = false;
  viewMode: 'chats';
  chats: any = [];
  sidenavTypes = [
    {
      name: 'Default Menu',
      value: 'default-menu'
    },
    {
      name: 'Separator Menu',
      value: 'separator-menu'
    },
    {
      name: 'Icon Menu',
      value: 'icon-menu'
    }
  ];
  sidebarColors: any[];
  topbarColors: any[];

  layoutConf;
  selectedMenu: string = 'icon-menu';
  selectedLayout: string;
  isTopbarFixed = false;
  isRTL = false;
  userDetails: any;
  egretThemes: ITheme[];
  perfectScrollbarEnabled: boolean = true;
  @ViewChild(PerfectScrollbarDirective, { static: false }) psContainer: PerfectScrollbarDirective;
  public vForm: FormGroup;
  categories: any;
  currentUser: any;
  chatId: any;
  chatInitCount = 0;
  botWriting = false;
  private clientUrl = '';

  constructor(
    private navService: NavigationService,
    private layout: LayoutService,
    private themeService: ThemeService,
    public customizer: CustomizerService,
    private cdr: ChangeDetectorRef,
    private api: ApiService,
    public sanitizer: DomSanitizer,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    public userService: UserService,
    private fb: FormBuilder,
    private chatService: ChatService
  ) {
    this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
  }

  ngOnInit() {
    this.api.socket.emit('connection', {});
    this.layoutConf = this.layout.layoutConf;
    this.selectedLayout = this.layoutConf.navigationPos;
    this.isTopbarFixed = this.layoutConf.topbarFixed;
    this.isRTL = this.layoutConf.dir === 'rtl';
    this.egretThemes = this.themeService.egretThemes;
    this.userDetails = this.userService.user();

    if ((this.userDetails || {}).image) {
      let path = this.userDetails.image;
      path = path.substr(16)
      this.userDetails.image = this.clientUrl + path;
    }

    this.buildF();
    this.getChatData();
    //this.getCat();
    //this.getCurrentUser();
  }
  ngOnDestroy() {

  }
  buildF() {
    this.vForm = this.fb.group({
      text: ['', Validators.required]
    });
    this.cdr.markForCheck();
  }
  chatOn(id) {
    if (this.chatInitCount === 0) {
      this.api.socket.on('AmiBot:msg:res' + id, (data) => {
        if (data.error) {
          this.confirmMsg('Fail', data.error);
        } else {
          this.chats.push(data);
          this.initMsgForm();
          this.cdr.markForCheck();
        }
      });
      this.chatInitCount = 1;
    }
  }

  getChatData() {
    if (localStorage.getItem('AmiChatId')) {
      this.chatService.getAllChats(localStorage.getItem('AmiChatId')).subscribe(res => {
        this.chats = res;
        console.log('this.chats', this.chats);
        this.initMsgForm();
        this.cdr.markForCheck();
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
    }

  }

  changeTheme(theme) {
    // this.themeService.changeTheme(theme);
    this.layout.publishLayoutChange({ matTheme: theme.name });
  }
  changeLayoutStyle(data) {
    this.layout.publishLayoutChange({ navigationPos: this.selectedLayout });
  }
  changeSidenav(data) {
    this.navService.publishNavigationChange(data.value);
  }
  toggleBreadcrumb(data) {
    this.layout.publishLayoutChange({ useBreadcrumb: data.checked });
  }
  toggleTopbarFixed(data) {
    this.layout.publishLayoutChange({ topbarFixed: data.checked });
  }
  toggleDir(data) {
    let dir = data.checked ? 'rtl' : 'ltr';
    this.layout.publishLayoutChange({ dir: dir });
  }
  tooglePerfectScrollbar(data) {
    this.layout.publishLayoutChange({ perfectScrollbar: this.perfectScrollbarEnabled })
  }

  sendMessage(e) {
    console.log("mesg", this.vForm.value);
    //this.vForm.value.createdBy = this.userDetails._id;
    this.vForm.value.created = new Date();
    this.vForm.value.botname = 'AmiBot';
    this.vForm.value.createdBy = 'User';
    if (localStorage.getItem('AmiChatId')) {
      this.vForm.value.chatId = localStorage.getItem('AmiChatId');
    } else {
      const d = new Date();
      let chatId = this.guid();
      this.vForm.value.chatId = chatId;
      localStorage.setItem('AmiChatId', chatId);
      this.chatOn(chatId);
    }
    this.chats.push(this.vForm.value);
    this.initMsgForm();
    setTimeout(() => {
      this.buildF();
      this.botWriting = true;
    }, 200);
    //this.api.socket.emit('user:msg:req', this.vForm.value);
    //this.api.socket.emit('AmiBot:msg:req', this.vForm.value);
    this.chatService.sendAmiBotMessage(this.vForm.value).subscribe(res => {
      this.botWriting = false;
      this.chats.push({ text: res.message, created: res.created, createdBy: 'AmiBot' });
      this.initMsgForm();
      this.cdr.markForCheck();
    }, err => {
      //this.confirmMsg('Fail', err.error);
    });

  }
  guid() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
      s4() + "-" + s4() + s4() + s4();
  }
  openCustumizer(flag) {
    this.viewMode = 'chats';
    this.userDetails = JSON.parse(localStorage.getItem('user'));
    if ((this.userDetails || {})._id) { }
    // ofline from chat
    if (flag === false && this.chats.length > 0) {
      this.isCustomizerOpen = flag;
      this.cdr.detectChanges();
    } else {
      this.isCustomizerOpen = flag;
      this.initMsgForm();
      this.cdr.detectChanges();
    }
  }
  initMsgForm() {
    setTimeout(() => {
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.psContainer) {
        this.psContainer.update();
        this.psContainer.scrollToBottom(0, 400);
      }
    })
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
  getCurrentUser() {
    if ((this.userDetails || {})._id) {
      this.chatService.getCurrentUser({ createdBy: this.userDetails._id }).subscribe(res => {
        this.currentUser = res;
        if ((this.currentUser || {}).chatId) {
          this.getChatData();
          this.chatOn((this.currentUser || {}).chatId);
        }
        console.log('this.currentUser', this.currentUser);
      }, err => {
        this.confirmMsg('Fail', err.error);
      });
    }
  }
  getCat() {
    this.api.getCategories('').subscribe(res => {
      this.categories = res;
      console.log('cate', res);
    }, err => {
      this.confirmMsg('Fail', err.error);
    });
  }

}
