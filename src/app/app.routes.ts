import { Routes } from '@angular/router';
import { LayoutComponent } from '../@core/layout/layout.component';
import { SignUpComponent } from './modules/sign-up/sign-up.component';
import { LoginComponent } from './modules/login/login.component';
import {HomeComponent} from './modules/home/home.component';
import {AuthGuard} from './common/auth/auth.guard'; // Import AuthGuard

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent, title: 'Home' }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    title: "Login page"
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: "Signup page"
  },
];
