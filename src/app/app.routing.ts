import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: './views/sessions/sessions.module#SessionsModule',
        data: { title: 'Session', roles: ['admin', 'student'] }
      },
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: './views/home/home.module#HomeModule',
        data: { title: 'Amida Educational Services', roles: ['student'] }
      },
      {
        path: 'admin',
        loadChildren: './views/admin/admin.module#AdminModule',
        canActivate: [AuthGuard],
        data: { title: 'Amida Admin' }
      },
      {
        path: 'profile',
        loadChildren: './views/profile/profile.module#ProfileModule',
        canActivate: [AuthGuard],
        data: { title: 'Profile', breadcrumb: 'PROFILE' }
      },
      {
        path: 'student',
        loadChildren: './views/student/student.module#StudentModule',
        canActivate: [AuthGuard],
        data: { title: 'Student', breadcrumb: 'Student'}
      },
      {
        path: 'course',
        loadChildren: './views/course/course.module#CourseModule',
        // canActivate: [AuthGuard],
        data: { title: 'Shop', breadcrumb: 'SHOP'}
      },
      {
        path: 'chat', 
        loadChildren: './views/app-chats/app-chats.module#AppChatsModule', 
        data: { title: 'Chat', breadcrumb: 'CHAT'}
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];

