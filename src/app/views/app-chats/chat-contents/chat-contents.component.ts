import { Component, OnInit, ViewChild, ViewChildren, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ChatService } from '../chat.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../shared/services/api.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPoint } from '../../../shared/services/server.service';
import { UserService } from '../../../shared/services/user.service';
@Component({
  selector: 'app-chat-contents',
  templateUrl: './chat-contents.component.html',
  styleUrls: ['./chat-contents.component.scss']
})
export class ChatContentsComponent implements OnInit, OnDestroy {
  public user: any;
  userDetails: any;
  public activeContact: any;
  public chatCollection: any;
  public vForm: FormGroup;
  userUpdateSub: Subscription;
  chatUpdateSub: Subscription;
  chatSelectSub: Subscription;

  @Input('matSidenav') matSidenav;
  @ViewChild(PerfectScrollbarDirective, { static: false }) psContainer: PerfectScrollbarDirective;

  constructor(
    public chatService: ChatService,
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    public userService: UserService,
    private api: ApiService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.userDetails = this.userService.user();
    // Listen for user update
    this.vForm = this.fb.group({
      text: ['', Validators.required]
    });

    // Listen for contact change
    this.chatSelectSub = this.chatService.onChatSelected.subscribe(res => {
      if (res) {
        console.log('res', res);
        this.chatCollection = res.chatCollection;
        this.activeContact = res.contact;
        this.initMsgForm();
        this.cdr.markForCheck();
      }
    });

    this.api.socket.on('admin:msg:res', (res) => {
      console.log('data', res);
      this.chatCollection.push(res);
      this.initMsgForm();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.userUpdateSub) this.userUpdateSub.unsubscribe();
    if (this.chatSelectSub) this.chatSelectSub.unsubscribe();
    if (this.chatUpdateSub) this.chatUpdateSub.unsubscribe();
  }

  sendMessage(e) {
    // console.log(this.msgForm.form.value.message)
    this.vForm.value.chatId = this.activeContact.chatId;
    this.vForm.value.createdBy = this.userDetails._id;
    this.vForm.value.role = this.userDetails.role;
    this.chatCollection.push(this.vForm.value);
    this.initMsgForm();
    this.api.socket.emit('user:msg:req', this.vForm.value);
    setTimeout(() => {
      this.vForm = this.fb.group({
        text: ['', Validators.required]
      });
      this.cdr.markForCheck();
    }, 200);
  }

  initMsgForm() {
    setTimeout(() => {
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.psContainer.update();
      this.psContainer.scrollToBottom(0, 400);
    });
  }
}
