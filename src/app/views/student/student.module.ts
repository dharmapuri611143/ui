import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { CountdownModule } from 'ngx-countdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { StudentRoutingModule } from './student-routing.module';
import { SDashboardComponent } from './s-dashboard/s-dashboard.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { AssessmentsComponent } from './assessments/assessments.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { SharedDirectivesModule } from '../../shared/directives/shared-directives.module';
import { HtmlContentPopupComponent } from '../course/html-content-popup/html-content-popup.component';

@NgModule({
  declarations: [ SDashboardComponent, MyOrdersComponent, MyOrderComponent, AssessmentsComponent, AssessmentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StudentRoutingModule,
    FlexLayoutModule,
    ChartsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    SharedPipesModule,
    SharedMaterialModule,
    CountdownModule,
    SharedDirectivesModule
  ],
  entryComponents: []
})
export class StudentModule { }
