import { SafePipe } from './../../shared/pipes/safedata';
import { GapiSession } from './../../services/gapi.session';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatGridListModule,
  MatExpansionModule,
  MatTabsModule,
  MatTableModule,
  MatRadioModule,
  MatTooltipModule,
  MatDialogModule,
  MatAutocompleteModule
 } from '@angular/material';
 import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { GenConfigComponent } from './gen-config/gen-config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { InquiryListComponent } from './inquiry-list/inquiry-list.component';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { BlogComponent } from './blog/blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { QuillModule } from 'ngx-quill';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { CourseListComponent } from './course-list/course-list.component';
import { CategoryOpComponent } from './category-op/category-op.component';
import { AssessmentOpComponent } from './assessment-op/assessment-op.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { OrdersComponent } from './orders/orders.component';
import { UserRegPopupComponent } from './user-reg-popup/user-reg-popup.component';
import { AssignOrderComponent } from './orders/assign-order/assign-order.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { FreeMaterialComponent } from './free-material/free-material.component';
import { BreviewsComponent } from './breviews/breviews.component';
import { BlogCategoryModalComponent } from './blog-list/blog-category-modal/blog-category-modal.component';
import { CareersComponent } from './careers/careers.component';
import { CareerDetailComponent } from './careers/career-detail/career-detail.component';
import { AppliedJobComponent } from './careers/applied-job/applied-job.component';
import { ShowVideoComponent } from './show-video/show-video.component';

@NgModule({
  declarations: [SafePipe,DashboardComponent, CustomerListComponent, GenConfigComponent, InquiryListComponent, BlogComponent, BlogListComponent, CourseListComponent, CategoryOpComponent, AssessmentOpComponent, QuestionListComponent, OrdersComponent, UserRegPopupComponent, AssignOrderComponent, ReviewsComponent, FreeMaterialComponent, BreviewsComponent, BlogCategoryModalComponent, CareersComponent, CareerDetailComponent, AppliedJobComponent, ShowVideoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    QuillModule,
    RichTextEditorAllModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatButtonModule,
    MatRadioModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatGridListModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ChartsModule,
    MatAutocompleteModule,
    NgxEchartsModule,
    NgxDatatableModule,
    SharedPipesModule,
    MatTooltipModule,
    SharedMaterialModule
  ],
  providers:[],
  entryComponents: [UserRegPopupComponent, AssignOrderComponent, BlogCategoryModalComponent]
})
export class AdminModule { }
