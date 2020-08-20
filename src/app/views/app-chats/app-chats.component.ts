import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatSidenav, MatDialog } from '@angular/material';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './app-chats.component.html',
  styleUrls: ['./app-chats.component.css']
})
export class AppChatsComponent implements OnInit, OnDestroy {
  isMobile;
  screenSizeWatcher: Subscription;
  isSidenavOpen: Boolean = true;
  @ViewChild(MatSidenav, {static: false}) public sideNav: MatSidenav;

  activeChatUser = {
    name: 'Gevorg Spartak',
    photo: 'assets/images/face-2.jpg',
    isOnline: true,
    lastMsg: 'Hello!'
  };
  user;


  constructor(
    private mediaObserver: MediaObserver, 
    public chatService: ChatService
  ) {
    // console.log(chatService.chats)
    this.user = chatService.user
  }

  ngOnInit() {
    this.chatSideBarInit();
  }
  ngOnDestroy() {
    if (this.screenSizeWatcher) {
      this.screenSizeWatcher.unsubscribe();
    }
  }
  changeActiveUser(user) {
    this.activeChatUser = user;
  }
  updateSidenav() {
    var self = this;
    setTimeout(() => {
      self.isSidenavOpen = !self.isMobile;
      self.sideNav.mode = self.isMobile ? 'over' : 'side';
    });
  }
  chatSideBarInit() {
    this.isMobile = this.mediaObserver.isActive('xs') || this.mediaObserver.isActive('sm');
    this.updateSidenav();
    this.screenSizeWatcher = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias === 'xs') || (change.mqAlias === 'sm');
      this.updateSidenav();
    });
  }
}
