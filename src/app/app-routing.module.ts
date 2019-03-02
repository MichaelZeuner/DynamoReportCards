import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportCardsComponent } from './report-cards/report-cards.component';
import { LoginComponent } from './login/login.component';
import { ApproveReportCardsComponent } from './approve-report-cards/approve-report-cards.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ReportCardsComponent },
  { path: 'approve', component: ApproveReportCardsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
