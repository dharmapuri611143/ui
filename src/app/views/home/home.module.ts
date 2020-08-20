
import { BlogComponent } from './blog/blog.component';
import { HeadingComponent } from './heading/heading.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { AgmCoreModule } from '@agm/core';
import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { OurServiceComponent } from './our-service/our-service.component';
import { HowItsWorkComponent } from './how-its-work/how-its-work.component';
import { WhyUsComponent } from './why-us/why-us.component';
import { SendInquiryComponent } from './send-inquiry/send-inquiry.component';
import { HomeSliderComponent } from './home-slider/home-slider.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import {AngularOpenlayersModule} from 'ngx-openlayers';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { EmailVerifyComponent } from './email-verify/email-verify.component';
import { CareerlistComponent } from './careerlist/careerlist.component';
import { JdDetailComponent } from './careerlist/jd-detail/jd-detail.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedMaterialModule,
    AngularOpenlayersModule,
    PerfectScrollbarModule,
    RouterModule.forChild(HomeRoutes)
  ],
  declarations: [HomeComponent,
    HeadingComponent,
    BlogComponent,
    OurServiceComponent,
    HowItsWorkComponent,
    WhyUsComponent,
    SendInquiryComponent,
    HomeSliderComponent,
    ContactUsComponent,
    AboutUsComponent,
  BlogDetailComponent,
BlogListComponent,
EmailVerifyComponent,
PrivacyPolicyComponent,
TermsOfServiceComponent,
DisclaimerComponent,
CareerlistComponent,
JdDetailComponent]
})
export class HomeModule { }
