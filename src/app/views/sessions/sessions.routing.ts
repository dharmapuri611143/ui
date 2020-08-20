import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { Signin2Component } from './signin2/signin2.component';
import { Signup2Component } from './signup2/signup2.component';
import { ForgetPwdComponent } from './forget-pwd/forget-pwd.component';
export const SessionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signup',
        component: Signup2Component,
        data: { title: 'Signup', roles: ['Service Provider', 'Super Admin', 'Pilot', 'student'] }
      },
      {
        path: 'signin',
        component: Signin2Component,
        data: { title: 'Signin', roles: ['Service Provider', 'Super Admin', 'Pilot', 'student'] }
      },
      {
        path: '404',
        component: NotFoundComponent,
        data: { title: 'Not Found', roles: ['Service Provider', 'Super Admin', 'Pilot', 'student'] }
      },
      {
        path: 'forgetpwd',
        component: ForgetPwdComponent,
        data: { title: 'Forget Password', roles: ['Service Provider', 'Super Admin', 'Pilot', 'student'] }
      }
    ]
  }
];
