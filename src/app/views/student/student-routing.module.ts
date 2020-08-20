import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SDashboardComponent } from './s-dashboard/s-dashboard.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { IsactiveResolverService } from '../../shared/services/isactive-resolver.service';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: SDashboardComponent,
      resolve: {
        isactive: IsactiveResolverService
      },
      data: { title: 'Student Dashboard', breadcrumb: 'Dashboard', roles: ['student'] }
    },
    {
      path: 'myorder',
      component: MyOrdersComponent,
      resolve: {
        isactive: IsactiveResolverService
      },
      data: { title: 'My Orders', breadcrumb: 'My Orders', roles: ['student'] }
    },
    {
      path: 'viewcourse',
      component: MyOrderComponent,
      resolve: {
        isactive: IsactiveResolverService
      },
      data: { title: 'View Course', breadcrumb: 'View Course', roles: ['student'] }
    },
    {
      path: 'assesss',
      component: AssessmentsComponent,
      resolve: {
        isactive: IsactiveResolverService
      },
      data: { title: 'Assessments', roles: ['student'] }
    },
    {
      path: 'assess',
      component: AssessmentComponent,
      resolve: {
        isactive: IsactiveResolverService
      },
      data: { title: 'Assessment', roles: ['student'] }
    }
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
