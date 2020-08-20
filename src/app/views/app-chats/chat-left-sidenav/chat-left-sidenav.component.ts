import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ChatService } from "../chat.service";
import { Subscription } from "rxjs";
import { ApiService } from '../../../shared/services/api.service';
@Component({
  selector: "app-chat-left-sidenav",
  templateUrl: "./chat-left-sidenav.component.html",
  styleUrls: ["./chat-left-sidenav.component.scss"]
})
export class ChatLeftSidenavComponent implements OnInit {
  userUpdateSub: Subscription;
  loadDataSub: Subscription;
  isSidenavOpen = true;
  currentUser: any;
  contacts: any[];

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.api.socket.on('admin:msg:ucontact', (res) => {
      console.log('data', res);
     this.loadChatData();
      this.cdr.markForCheck();
    });
    this.loadChatData();
    this.userUpdateSub = this.chatService.onUserUpdated
      .subscribe(updatedUser => {
        this.currentUser = updatedUser;
      });
  }

  loadChatData() {
    this.loadDataSub = this.chatService.loadChatData()
    .subscribe(res => {
      this.currentUser = this.chatService.user;
      // this.chats = this.chatService.chats;
      this.contacts = this.chatService.contacts;
      console.log('this.contacts', this.contacts);
      this.cdr.markForCheck();
    });
  }
  ngOnDestroy() {
    if( this.userUpdateSub ) this.userUpdateSub.unsubscribe();
    if( this.loadDataSub ) this.loadDataSub.unsubscribe();
  }

  getChatByContact(chatId) {
    this.chatService.getChatByContact(chatId)
      .subscribe(res => {
        // console.log('from sub',res);
      }, err => {
        console.log(err)
      });
  }
}
