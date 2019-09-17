import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportCardsComponent } from './report-cards/report-cards.component';
import { LoginComponent } from './login/login.component';
import { ApproveReportCardsComponent } from './approve-report-cards/approve-report-cards.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { CompletedReportCardsComponent } from './completed-report-cards/completed-report-cards.component';
import { LevelsComponent } from './levels/levels.component';
import { UsersComponent } from './users/users.component';
import { EventsComponent } from './events/events.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { PrintReportCardComponent } from './print-report-card/print-report-card.component';
import { LevelGroupsComponent } from './level-groups/level-groups.component';
import { SentBackReportCardsComponent } from './sent-back-report-cards/sent-back-report-cards.component';
import { AthletesComponent } from './athletes/athletes.component';
import { CommentsComponent } from './comments/comments.component';

const routes: Routes = [
	{
		path: '',
		component: MainLayoutComponent,
		canActivate: [ AuthGuard ],
		children: [
			{ path: '', component: ReportCardsComponent },
			{ path: 'approve', component: ApproveReportCardsComponent },
			{ path: 'completed', component: CompletedReportCardsComponent },
			{ path: 'level-groups', component: LevelGroupsComponent },
			{ path: 'levels', component: LevelsComponent },
			{ path: 'events', component: EventsComponent },
			{ path: 'users', component: UsersComponent },
			{ path: 'athletes', component: AthletesComponent },
			{ path: 'comments', component: CommentsComponent },
			{ path: 'sent-back-report-cards', component: SentBackReportCardsComponent }
		]
	},
	{
		path: '',
		component: LoginLayoutComponent,
		children: [ { path: 'login', component: LoginComponent } ]
	},
	{
		path: 'print',
		outlet: 'print',
		component: PrintLayoutComponent,
		canActivate: [ AuthGuard ],
		children: [ { path: 'report-card/:athleteIds', component: PrintReportCardComponent } ]
	},
	{ path: '**', redirectTo: '' }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
