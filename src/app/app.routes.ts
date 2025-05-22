import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { AddCategoryComponent } from './components/admin/add-category/add-category.component';
import { UpdateCategoryComponent } from './components/admin/update-category/update-category.component';
import { ProductsComponent } from './components/products/products.component';
import { UpdateProductComponent } from './components/admin/update-product/update-product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { FaqComponent } from './components/static-pages/faq/faq.component';
import { PageNotFoundComponent } from './components/static-pages/page-not-found/page-not-found.component';
import { PrivacyPolicyComponent } from './components/static-pages/privacy-policy/privacy-policy.component';
import { ReturnsComponent } from './components/static-pages/returns/returns.component';
import { ShippingComponent } from './components/static-pages/shipping/shipping.component';
import { SizeGuideComponent } from './components/static-pages/size-guide/size-guide.component';
import { TermsConditionsComponent } from './components/static-pages/terms-conditions/terms-conditions.component';
import { UpdateHeroComponent } from './components/admin/update-hero/update-hero.component';
import { CartDetailsComponent } from './components/cart/cart-details/cart-details.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { adminGuard } from './guard/admin.guard';
import { PaymentCancelComponent } from './components/payment/payment-cancel/payment-cancel.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderConfirmationComponent } from './components/payment/order-confirmation/order-confirmation.component';





export const routes: Routes = [
    {path: 'admin/add-product', component: AddProductComponent, canActivate: [adminGuard]},
    {path: 'admin/add-category', component: AddCategoryComponent, canActivate: [adminGuard]},
    {path: 'admin/update-category', component: UpdateCategoryComponent, canActivate: [adminGuard]},
    {path: 'admin/update-product/:id', component: UpdateProductComponent, canActivate: [adminGuard]},
    {path: 'admin/update-hero', component: UpdateHeroComponent, canActivate: [adminGuard]},

    {path: 'account', component: UserAccountComponent, canActivate: [AuthGuard]},

    {path: 'cancel', component: PaymentCancelComponent},
    {path: 'success', component: OrderConfirmationComponent},

    {path: 'orders', component: OrderHistoryComponent, canActivate: [AuthGuard]},
    {path: 'orders/:id', component: OrderDetailsComponent, canActivate: [AuthGuard]},

    {path: 'home', component: HomeComponent},
    {path: 'product-details/:id', component: ProductDetailsComponent},
    {path: 'products/:gender', component: ProductsComponent},
    {path: 'search/:keyword', component: ProductsComponent},

    {path: 'cart-details', component: CartDetailsComponent},

    {path: 'faq', component: FaqComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'returns', component: ReturnsComponent},
    {path: 'shipping', component: ShippingComponent},
    {path: 'size-guide', component: SizeGuideComponent},
    {path: 'terms-conditions', component: TermsConditionsComponent},

    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent}
];
