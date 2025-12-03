import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Products } from './components/products/products';
import { ProductDetComponent } from './components/productdet/productdet';
import { About } from './components/about/about';
import { Cart } from './components/cart/cart';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';
import { Payment } from './components/payment/payment';
import { Delivery } from './components/delivery/delivery';
import { Confirm } from './components/confirm/confirm';
import { AdminComponent } from './components/admin/admin';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'products', component: Products },
    { path: 'productdet/:id', component: ProductDetComponent },
    { path: 'about', component: About },
    { path: 'cart', component: Cart },
    { path: 'delivery', component: Delivery },
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent },
    { path: 'payment', component: Payment },
    { path: 'confirm', component: Confirm },
    { path: 'admin', component: AdminComponent},
];
