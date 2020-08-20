import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { EmailVerifyComponent } from './email-verify/email-verify.component';
import { CareerlistComponent } from './careerlist/careerlist.component';
import { JdDetailComponent } from './careerlist/jd-detail/jd-detail.component';

export const HomeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { title: 'Student', roles: ['student'] }
      },
      {
        path: 'contactus',
        component: ContactUsComponent,
        data: { title: 'Contact Us', roles: ['student'] }
      },
      {
        path: 'aboutus',
        component: AboutUsComponent,
        data: { title: 'About Us', roles: ['student'] }
      },
      {
        path: 'blogl',
        component: BlogListComponent,
        data: { title: 'Blog List', roles: ['student'] }
      },
      {
        path: 'blogd',
        component: BlogDetailComponent,
        data: { title: 'Blog Detail View', roles: ['student'] }
      },
      {
        path: 'privacy',
        component: PrivacyPolicyComponent,
        data: { title: 'Privacy Policy', roles: ['student', 'admin'] }
      },
      {
        path: 'tofs',
        component: TermsOfServiceComponent,
        data: { title: 'Terms Of Service', roles: ['student', 'admin'] }
      },
      {
        path: 'dsclm',
        component: DisclaimerComponent,
        data: { title: 'Disclaimer', roles: ['student', 'admin'] }
      },
      {
        path: 'emailverify',
        component: EmailVerifyComponent,
        data: { title: 'Email Verification', roles: ['Service Provider', 'Super Admin', 'Pilot', 'student'] }
      },
      {
        path: 'careerlist',
        component: CareerlistComponent,
        data: { title: 'Job List', roles: ['student'] }
      },
      {
        path: 'jd',
        component: JdDetailComponent,
        data: { title: 'Job Description', roles: ['student'] }
      }
    ]

  }
];