import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReportCardsComponent } from './report-cards/report-cards.component';
import { ApproveReportCardsComponent } from './approve-report-cards/approve-report-cards.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatAutocompleteModule, MatFormFieldModule, MatOptionModule, MatInputModule, MatCardModule, MatExpansionModule, MatGridListModule, MatButtonToggleModule, MatDividerModule, MatBadgeModule, MatDialogModule, MatSnackBarModule } from '@angular/material';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AthletesSelectComponent } from './report-cards/athlete-select.component';
import { LevelSelectComponent } from './report-cards/level-select.component';
import { ReportCardEventsComponent } from './report-cards/events.component';
import { SkillsComponent } from './report-cards/skills.component';
import { CompletedReportCardsComponent } from './completed-report-cards/completed-report-cards.component';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { ReportCardPanelComponent, RequiredModificationsDialog } from './approve-report-cards/report-card-panel.component';
import { UsersComponent } from './users/users.component';
import { LevelsComponent } from './levels/levels.component';
import { EventsComponent } from './events/events.component';

@NgModule({
  declarations: [
    AppComponent,
    ReportCardsComponent,
    ApproveReportCardsComponent,
    LoginComponent,
    MainNavComponent,
    RequiredModificationsDialog,
    MainLayoutComponent,
    LoginLayoutComponent,
    AthletesSelectComponent,
    LevelSelectComponent,
    ReportCardEventsComponent,
    SkillsComponent,
    CompletedReportCardsComponent,
    MatConfirmDialogComponent,
    ReportCardPanelComponent,
    UsersComponent,
    LevelsComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatCardModule,
    MatExpansionModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatBadgeModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  entryComponents: [
    RequiredModificationsDialog,
    MatConfirmDialogComponent
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
