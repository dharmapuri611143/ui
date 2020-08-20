import { Routes } from '@angular/router';

import { ProfileComponent } from "./profile.component";
import { ProfileOverviewComponent } from "./profile-overview/profile-overview.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { ProfileBlankComponent } from "./profile-blank/profile-blank.component";

export const ProfileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [{
      path: 'overview',
      component: ProfileOverviewComponent,
      data: { title: 'Overview', breadcrumb: 'OVERVIEW', roles: ['Service Provider', 'Super Admin', 'Pilot', 'student'] }
    },
    {
      path: 'settings',
      component: ProfileSettingsComponent,
      data: { title: 'Settings', breadcrumb: 'SETTINGS', roles: ['Service Provider', 'Super Admin', 'Pilot', 'student'] }
    },
    {
      path: 'blank',
      component: ProfileBlankComponent,
      data: { title: 'Blank', breadcrumb: 'BLANK', roles: ['Service Provider', 'Super Admin', 'Pilot', 'student'] }
    }]
  }
];