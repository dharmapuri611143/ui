import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { FlexLayoutModule } from '@angular/flex-layout';
import { 
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatChipsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatListModule,
  MatSidenavModule,
  MatRippleModule,
  MatPaginatorModule,
  MatDialogModule
 } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StarRatingModule } from 'angular-star-rating';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedDirectivesModule } from 'app/shared/directives/shared-directives.module';

import { CourseRoutingModule } from './course-routing.module';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { PaymentDoneComponent } from './payment-done/payment-done.component';
import { GalleryComponent } from './gallery/gallery.component';
import { FreeCMaterialComponent } from './free-c-material/free-c-material.component';
import { FreeMatDetailComponent } from './free-mat-detail/free-mat-detail.component';
import { NoRightClickDirective } from 'app/shared/directives/no-right-click.directive';
@NgModule({
  declarations: [ ProductsComponent, CartComponent, CheckoutComponent, ProductDetailsComponent, PaymentDoneComponent, GalleryComponent, FreeCMaterialComponent, FreeMatDetailComponent, NoRightClickDirective],
  imports: [
    CommonModule,
    CourseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatRippleModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    MatListModule,
    MatSidenavModule,
    MatPaginatorModule,
    StarRatingModule.forRoot(),
    NgxPaginationModule,
    NgxDatatableModule,
    SharedDirectivesModule
  ],
  providers: [],
  entryComponents: []
})
export class CourseModule { }
