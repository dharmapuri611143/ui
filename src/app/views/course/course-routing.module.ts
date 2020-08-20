import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentDoneComponent } from './payment-done/payment-done.component';
import { GalleryComponent } from './gallery/gallery.component';
import { AuthGuard } from '../../shared/services/auth/auth.guard';
import { FreeCMaterialComponent } from './free-c-material/free-c-material.component';
import { FreeMatDetailComponent } from './free-mat-detail/free-mat-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
      path: '',
      component: ProductsComponent,
      data: { title: 'Product', breadcrumb: 'Product', roles: ['student'] }
    },
    {
      path: 'cart',
      component: CartComponent,
      canActivate: [AuthGuard],
      data: { title: 'Cart List', breadcrumb: 'CART', roles: ['student'] }
    },
    {
      path: 'products/:id',
      component: ProductDetailsComponent,
      data: { title: 'Product', breadcrumb: 'Product', roles: ['student'] }
    },
    {
      path: 'checkout',
      component: CheckoutComponent,
      canActivate: [AuthGuard],
      data: { title: 'Checkout', breadcrumb: 'Checkout', roles: ['student'] }
    },
    {
      path: 'paymentdone',
      component: PaymentDoneComponent,
      canActivate: [AuthGuard],
      data: { title: 'Payment', breadcrumb: 'Payment', roles: ['student'] }
    },
    {
      path: 'gallery',
      component: GalleryComponent,
      data: { title: 'Gallery', breadcrumb: 'Gallery', roles: ['student'] }
    },
    {
      path: 'freemat',
      component: FreeCMaterialComponent,
      data: { title: 'Free Material', breadcrumb: 'Free Material', roles: ['student'] }
    },
    {
      path: 'freematd/:id',
      component: FreeMatDetailComponent,
      data: { title: 'Free Material', breadcrumb: 'Free Material', roles: ['student'] }
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
