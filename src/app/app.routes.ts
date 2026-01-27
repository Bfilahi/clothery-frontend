import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { adminGuard } from './guard/admin.guard';



export const routes: Routes = [
    {
        path: '',
        canActivate: [adminGuard],
        children: [
            {
                path: 'admin/add-product',
                loadComponent: () => import('./components/admin/add-product/add-product.component').then(m => m.AddProductComponent)
            },
            {
                path: 'admin/add-category',
                loadComponent: () => import('./components/admin/add-category/add-category.component').then(m => m.AddCategoryComponent)
            },
            {
                path: 'admin/update-category',
                loadComponent: () => import('./components/admin/update-category/update-category.component').then(m => m.UpdateCategoryComponent)
            },
            {
                path: 'admin/update-product/:id',
                loadComponent: () => import('./components/admin/update-product/update-product.component').then(m => m.UpdateProductComponent)
            },
            {
                path: 'admin/update-hero',
                loadComponent: () => import('./components/admin/update-hero/update-hero.component').then(m => m.UpdateHeroComponent)
            }
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'account',
                loadComponent: () => import('./components/user-account/user-account.component').then(m => m.UserAccountComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./components/order-history/order-history.component').then(m => m.OrderHistoryComponent)
            },
            {
                path: 'orders/:id',
                loadComponent: () => import('./components/order-details/order-details.component').then(m => m.OrderDetailsComponent)
            }
        ]
    },
    {
        path: 'cancel',
        loadComponent: () => import('./components/payment/payment-cancel/payment-cancel.component').then(m => m.PaymentCancelComponent)
    },
    {
        path: 'success',
        loadComponent: () => import('./components/payment/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'product-details/:id',
        loadComponent: () => import('./components/product-details/product-details.component').then(m => m.ProductDetailsComponent)
    },
    {
        path: 'products/:gender',
        loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
    },
    {
        path: 'search/:keyword',
        loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
    },
    {
        path: 'cart-details',
        loadComponent: () => import('./components/cart/cart-details/cart-details.component').then(m => m.CartDetailsComponent)
    },
    {
        path: 'faq',
        loadComponent: () => import('./components/static-pages/faq/faq.component').then(m => m.FaqComponent)
    },
    {
        path: 'privacy-policy',
        loadComponent: () => import('./components/static-pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
    },
    {
        path: 'returns',
        loadComponent: () => import('./components/static-pages/returns/returns.component').then(m => m.ReturnsComponent)
    },
    {
        path: 'shipping',
        loadComponent: () => import('./components/static-pages/shipping/shipping.component').then(m => m.ShippingComponent)
    },
    {
        path: 'size-guide',
        loadComponent: () => import('./components/static-pages/size-guide/size-guide.component').then(m => m.SizeGuideComponent)
    },
    {
        path: 'terms-conditions',
        loadComponent: () => import('./components/static-pages/terms-conditions/terms-conditions.component').then(m => m.TermsConditionsComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./components/static-pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
    },

    {path: '', redirectTo: '/home', pathMatch: 'full'},

];
