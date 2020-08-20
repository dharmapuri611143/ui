import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService){ }

  ngOnInit() {
    this.userService.logoutEvent.emit('Logout');
  }

  ngOnDestroy(): void {
   
  }
}
