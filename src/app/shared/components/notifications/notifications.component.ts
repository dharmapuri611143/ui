import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  @Input() notificPanel;

  // Dummy notifications
  notifications: any = []

  constructor(private router: Router,
    public userService: UserService,
    public api: ApiService,
    private cdf: ChangeDetectorRef,) {}

  ngOnInit() {
    this.router.events.subscribe((routeChange) => {
        if (routeChange instanceof NavigationEnd) {
          this.notificPanel.close();
        }
    });
    const user = this.userService.user();
    if ((user ||{})._id) {
      this.api.myNoti({to: user._id}).subscribe(res => {
        this.notifications = res;
        console.log('this.notifications', this.notifications);
        console.log()
        this.cdf.detectChanges();
      });
    }
  }
  readNote(id) {
    let notArray = [];
    for (let item of this.notifications) {
      if (id === item._id) {
      } else {
        notArray.push(item);
      }
    }
    this.notifications = notArray;
    this.api.notifyEvent.emit('');
    this.cdf.detectChanges();
    this.api.readNoti({_id: id}).subscribe(res => {});
  }
  clearAll(e) {
    e.preventDefault();
    this.notifications = [];
  }
}
