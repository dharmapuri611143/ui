import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html'
})
export class SidenavComponent {
  @Input('items') public menuItems: any[] = [];
  userDetails: any;
  constructor(public userService: UserService) {}
  ngOnInit() {
    // this.userService.logoutEvent.subscribe(res => {
    //   this.initFun();
    //   this.addMenuItem();
    // });
   this.initFun()
  }
  initFun() {
    this.userDetails = this.userService.user();
  }
  // Only for demo purpose
  addMenuItem() {
    this.menuItems.push({
      name: 'ITEM',
      type: 'dropDown',
      tooltip: 'Item',
      icon: 'done',
      state: 'material',
      sub: [
        {name: 'SUBITEM', state: 'cards'},
        {name: 'SUBITEM', state: 'buttons'}
      ]
    });
  }
}