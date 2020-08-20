import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss']
})
export class EmailVerifyComponent implements OnInit {
  msg = '';
  constructor(public route: ActivatedRoute, public userService: UserService,
    private loader: AppLoaderService,
    private cdf: ChangeDetectorRef,
    private appear: AppConfirmService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loader.open();
      setTimeout(() => {
        this.userService.mailVerify({_id: params.id}).subscribe(res => {
          this.msg = res.msg;
          this.cdf.detectChanges();
          this.loader.close();
          this.confirmMsg('Success', res.msg);
        }, err => {
          this.loader.close();
          this.confirmMsg('Fail', err.error);
        });
      }, 100);
   
    });
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }
}
