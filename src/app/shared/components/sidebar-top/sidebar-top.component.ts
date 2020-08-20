import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
// import PerfectScrollbar from 'perfect-scrollbar';
import { NavigationService } from "../../../shared/services/navigation.service";
import { Subscription } from "rxjs";
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-sidebar-top',
  templateUrl: './sidebar-top.component.html'
})
export class SidebarTopComponent implements OnInit, OnDestroy, AfterViewInit {
  // private sidebarPS: PerfectScrollbar;
  public menuItems: any[];
  private menuItemsSub: Subscription;
  constructor(
    private navService: NavigationService,
    private userService: UserService
  ) { }

  ngOnInit() {
  this.initFun();
  // this.userService.logoutEvent.subscribe(res => {
  //   this.initFun();
  // });
  }

  initFun(){
    this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
      this.menuItems = menuItem.filter(item => item.type !== 'icon' && item.type !== 'separator');
    });
  }
  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.sidebarPS = new PerfectScrollbar('#sidebar-top-scroll-area', {
    //     suppressScrollX: true
    //   })
    // })
  }
  ngOnDestroy() {
    // if(this.sidebarPS) {
    //   this.sidebarPS.destroy();
    // }
    if( this.menuItemsSub ) {
      this.menuItemsSub.unsubscribe()
    }
  }

}
