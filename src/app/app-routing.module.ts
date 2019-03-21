import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportCardsComponent } from './report-cards/report-cards.component';
import { LoginComponent } from './login/login.component';
import { ApproveReportCardsComponent } from './approve-report-cards/approve-report-cards.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ReportCardsComponent },
      { path: 'approve', component: ApproveReportCardsComponent }
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
