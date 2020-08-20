import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  activeView = 'overview';
  userDetails: any;
  private clientUrl = '';  

  constructor(private router: ActivatedRoute,
    public sanitizer: DomSanitizer, public userService: UserService,
    public api: ApiService) {
      this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
     }

  ngOnInit() {
    this.userDetails = this.userService.user();
    if ((this.userDetails ||{}).image) {
      let path = this.userDetails.image;
      path = path.substr(16)
      this.userDetails.image =  this.clientUrl + path;
    }
    console.log('this.userDetails', this.userDetails);
    this.activeView = this.router.snapshot.params['view'];
  }
}
