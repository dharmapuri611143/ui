import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { GenConfigComponent } from './gen-config/gen-config.component';
import { InquiryListComponent } from './inquiry-list/inquiry-list.component';
import { BlogComponent } from './blog/blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { CategoryOpComponent } from './category-op/category-op.component';
import { CourseListComponent } from './course-list/course-list.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { OrdersComponent } from './orders/orders.component';
import { AssessmentOpComponent } from './assessment-op/assessment-op.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { FreeMaterialComponent } from './free-material/free-material.component';
import { BreviewsComponent } from './breviews/breviews.component';
import { CareersComponent } from './careers/careers.component';
import { CareerDetailComponent } from './careers/career-detail/career-detail.component';
import { AppliedJobComponent } from './careers/applied-job/applied-job.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: { title: 'Admin Dashboard', breadcrumb: 'Dashboard', roles: ['admin', 'super admin'] }
      },
      {
        path: 'clist',
        component: CustomerListComponent,
        data: { title: 'Customer List', breadcrumb: 'Customer List', roles: ['admin'] }
      },
      {
        path: 'config',
        component: GenConfigComponent,
        data: { title: 'Admin Config', breadcrumb: 'Admin Config', roles: ['admin'] }
      },
      {
        path: 'addblog',
        component: BlogComponent,
        data: { title: 'Admin Config', breadcrumb: 'Admin Config', roles: ['admin'] }
      },
      {
        path: 'bloglist',
        component: BlogListComponent,
        data: { title: 'Admin Config', breadcrumb: 'Admin Config', roles: ['admin'] }
      },
      {
        path: 'inquirylist',
        component: InquiryListComponent,
        data: { title: 'Inquiry List', breadcrumb: 'Inquiry List', roles: ['admin', 'student'] }
      },
      {
        path: 'catl',
        component: CategoryOpComponent,
        data: { title: 'Category List', breadcrumb: 'Category List', roles: ['admin'] }
      },
      {
        path: 'colist',
        component: CourseListComponent,
        data: { title: 'Course List', breadcrumb: 'Course List', roles: ['admin'] }
      },
      {
        path: 'colist',
        component: CourseListComponent,
        data: { title: 'Course List', breadcrumb: 'Course List', roles: ['admin'] }
      },
      {
        path: 'qlist',
        component: QuestionListComponent,
        data: { title: 'Question List', breadcrumb: 'Question List', roles: ['admin'] }
      },
      {
        path: 'aop',
        component: AssessmentOpComponent,
        data: { title: 'Assessment Veiw', breadcrumb: 'Assessment Veiw', roles: ['admin'] }
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: { title: 'Orders Veiw', breadcrumb: 'Orders Veiw', roles: ['admin'] }
      },
      {
        path: 'reviews',
        component: ReviewsComponent,
        data: { title: 'Reviews List', breadcrumb: 'Reviews List', roles: ['admin'] }
      },
      {
        path: 'breviews',
        component: BreviewsComponent,
        data: { title: 'Reviews List', breadcrumb: 'Reviews List', roles: ['admin'] }
      },
      {
        path: 'fmat',
        component: FreeMaterialComponent,
        data: { title: 'Free Material', breadcrumb: 'Free Material', roles: ['admin'] }
      },
      {
        path: 'careers',
        component: CareersComponent,
        data: { title: 'Careers', breadcrumb: 'Careers', roles: ['admin'] }
      },
      {
        path: 'career',
        component: CareerDetailComponent,
        data: { title: 'Careers', breadcrumb: 'Careers', roles: ['admin'] }
      },
      {
        path: 'aplyjlist',
        component: AppliedJobComponent,
        data: { title: 'Careers', breadcrumb: 'Careers', roles: ['admin'] }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
