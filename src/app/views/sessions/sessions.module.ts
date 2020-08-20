import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from 'app/shared/shared-material.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { SessionsRoutes } from './sessions.routing';
import { NotFoundComponent } from './not-found/not-found.component';
import { Signup2Component } from './signup2/signup2.component';
import { Signin2Component } from './signin2/signin2.component';
import { ForgetPwdComponent } from './forget-pwd/forget-pwd.component';
import { ErrorComponent } from './error/error.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    RouterModule.forChild(SessionsRoutes)
  ],
  providers: [],
  declarations: [ NotFoundComponent, Signup2Component, Signin2Component, ForgetPwdComponent, ErrorComponent, ForgotPasswordComponent, LockscreenComponent]
})
export class SessionsModule { }
