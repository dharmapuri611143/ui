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
  selector: 'app-customizer',
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.scss'],
  animations: [egretAnimations],
  providers: [ChatService]
})
export class CustomizerComponent implements OnInit, OnDestroy {
  isCustomizerOpen: boolean = false;
  isBotCustomizerOpen: boolean = false;
  viewMode: 'chats';
  viewBotMode: 'chats';
  chats: any = [];
  botchats: any = [];
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
  public bForm: FormGroup;
  categories: any;
  currentUser: any;
  chatId: any;
  chatInitCount = 0;
  botWriting = false;
  botBWriting = false;
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
    this.buildB();
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
  buildB() {
    this.bForm = this.fb.group({
      text: ['', Validators.required]
    });
    this.cdr.markForCheck();
  }
  chatOn(id) {
    if (this.chatInitCount === 0) {
      this.api.socket.on('amidabot:msg:res' + id, (data) => {
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
    if (localStorage.getItem('AmidachatId')) {
      this.chatService.getAllChats(localStorage.getItem('AmidachatId')).subscribe(res => {
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
    this.vForm.value.botname = 'AmidaBot';
    this.vForm.value.createdBy = 'User';
    if (localStorage.getItem('AmidachatId')) {
      this.vForm.value.chatId = localStorage.getItem('AmidachatId');
    } else {
      const d = new Date();
      let chatId = this.guid();
      this.vForm.value.chatId = chatId;
      localStorage.setItem('AmidachatId', chatId);
      //this.chatOn(chatId);
    }
    this.chats.push(this.vForm.value);
    this.initMsgForm();
    setTimeout(() => {
      this.buildF();
      this.botWriting = true;
    }, 200);
    //this.api.socket.emit('user:msg:req', this.vForm.value);
    //this.api.socket.emit('amidabot:msg:req', this.vForm.value);
    
    this.saveMessages(this.vForm.value);
    this.chatService.sendAmidaBotMessage(this.vForm.value).subscribe(res => {
      this.botWriting = false;
      this.chats.push({  text: res.result.fulfillment.speech, created: new Date(), createdBy: 'AmidaBot' });
      let obj = this.vForm.value;
      obj.createdBy = 'AmidaBot';
      obj.botname = 'AmidaBot';
      obj.chatId = localStorage.getItem('AmidachatId');
      obj.text = res.result.fulfillment.speech;
      this.saveMessages(obj);
      this.initMsgForm();
      this.cdr.markForCheck();
    }, err => {
      //this.confirmMsg('Fail', err.error);
    });

  }

  sendBotMessage(e) {

    this.bForm.value.created = new Date();
    this.bForm.value.botname = 'AmiBot';
    this.bForm.value.createdBy = 'User';
    if (localStorage.getItem('AmichatId')) {
      this.bForm.value.chatId = localStorage.getItem('AmichatId');
    } else {
      const d = new Date();
      let chatId = this.guid();
      this.bForm.value.chatId = chatId;
      localStorage.setItem('AmichatId', chatId);
    }
    this.botchats.push(this.bForm.value);
    this.initMsgForm();
    setTimeout(() => {
      this.buildB();
      this.botBWriting = true;
    }, 200);
    console.log("mesg", this.bForm.value);
    this.chatService.sendAmiBotMessage(this.bForm.value).subscribe(res => {
      this.botBWriting = false;
      this.botchats.push({ text: res.result.fulfillment.speech, created: new Date(), createdBy: 'AmiBot' });
      this.initMsgForm();
      this.cdr.markForCheck();
    }, err => {

    });

  }

  saveMessages(data) {
    this.chatService.saveAmidaBotMessage(data).subscribe(res => {
      
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
  openBotCustumizer(flag) {
    this.viewBotMode = 'chats';
    this.userDetails = JSON.parse(localStorage.getItem('user'));
    if ((this.userDetails || {})._id) { }
    // ofline from chat
    if (flag === false && this.botchats.length > 0) {
      this.isBotCustomizerOpen = flag;
      this.cdr.detectChanges();
    } else {
      this.isBotCustomizerOpen = flag;
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
  // openCustumizer(flag) {
  //   this.viewMode = 'chats';
  //   this.userDetails = JSON.parse(localStorage.getItem('user'));
  //   if ((this.userDetails || {})._id) {
  //     // ofline from chat
  //     if (flag === false && this.chats.length > 0) {
  //       this.isCustomizerOpen = flag;
  //       this.cdr.detectChanges();
  //       Swal.fire({
  //         title: 'Are you sure?',
  //         text: 'Do you want to logout from chatbox?',
  //         type: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Yes, submit it!',
  //         cancelButtonText: 'No, keep it'
  //       }).then((result) => {
  //         if (result.value) {
  //           this.isCustomizerOpen = flag;
  //           this.cdr.detectChanges();
  //           this.api.socket.emit('user:msg:offline', { chatId: this.chats[0].chatId });
  //         }
  //       });
  //     } else {
  //       this.api.socket.emit('user:msg:loaduser', { chatId: this.chats[0].chatId });
  //       this.isCustomizerOpen = flag;
  //       this.initMsgForm();
  //       this.cdr.detectChanges();
  //     }
  //   } else {
  //     this.confirmMsg('Validation', 'Please Login/Register befor enter to communicate with admin');
  //   }
  // }
  // chatOn(id) {
  //   if (this.chatInitCount === 0) {
  //     this.api.socket.on('user:msg:res:' + id, (data) => {
  //       if (data.error) {
  //         this.confirmMsg('Fail', data.error);
  //       } else {
  //         this.chats.push(data);
  //         this.initMsgForm();
  //         this.cdr.markForCheck();
  //       }
  //     });
  //     this.chatInitCount = 1;
  //   }
  // }
  // buildF() {
  //   this.vForm = this.fb.group({
  //     text: ['', Validators.required],
  //     category: ['', Validators.required]
  //   });
  //   this.cdr.markForCheck();
  // }
  // sendMessage(e) {
  //   this.vForm.value.createdBy = this.userDetails._id;
  //   if ((this.currentUser || {}).chatId) {
  //     this.vForm.value.chatId = this.currentUser.chatId;
  //   } else {
  //     const d = new Date();
  //     const chatId = d.getTime();
  //     this.vForm.value.chatId = chatId;
  //     this.chatOn(chatId);
  //   }
  //   this.chats.push(this.vForm.value);
  //   this.initMsgForm();
  //   this.api.socket.emit('user:msg:req', this.vForm.value);
  //   setTimeout(() => {
  //     this.buildF();
  //   }, 200);
  // }
}
