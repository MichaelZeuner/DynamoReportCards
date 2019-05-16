import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSidenav } from "@angular/material";
import { AuthService } from '../auth/auth.service';
import { DataService } from '../data.service';
import { ReportCard } from '../interfaces/report-card';
import { ErrorApi } from '../interfaces/error-api';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  @ViewChild('drawer') sidenav: MatSidenav;

  public count: number = 0;
  public completedReportCards: number = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, public authService: AuthService, private data: DataService) {
    this.reloadApprovalNeeded();
    console.log(authService.user.access);
  }

  reloadApprovalNeeded() {
    this.data.getReportCardsNeedingApproval().subscribe(
      (data : ReportCard[]) => {
        console.log(data);
        this.count = data.length;
      },
      (err: ErrorApi) => {
        console.log(err.error.message);
        this.count = 0;
      });
  }

  closeNav() {
    this.isHandset$.subscribe(close => {
      if(close) {
        this.sidenav.close();
      }
    });
    
  }

  onLogout() {
    this.authService.logout();
  }
}
