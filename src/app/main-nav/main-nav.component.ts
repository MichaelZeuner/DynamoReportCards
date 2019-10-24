import { Component, ViewChild } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatSidenav } from "@angular/material";
import { AuthService } from "../auth/auth.service";
import { DataService } from "../data.service";
import { ReportCard } from "../interfaces/report-card";
import { ErrorApi } from "../interfaces/error-api";
import { User } from "../interfaces/user";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.css"]
})
export class MainNavComponent {
  @ViewChild("drawer") sidenav: MatSidenav;

  public user: User;
  public count: number = 0;
  public sentBackReportCards: number = 0;
  public displayLoading: Boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private data: DataService
  ) {
    this.reloadApprovalNeeded();
    this.reloadReportCardsSentBack();
    console.log(authService.user.access);

    this.user = authService.user;
  }

  reloadReportCardsSentBack() {
    this.data.getReportCardsSentBack().subscribe(
      (data: any[]) => {
        console.log(data);
        this.sentBackReportCards = data.length;
      },
      (err: ErrorApi) => {
        console.log(err.error.message);
        this.sentBackReportCards = 0;
      }
    );
  }

  reloadApprovalNeeded() {
    this.data.getReportCardsNeedingApproval().subscribe(
      (data: ReportCard[]) => {
        console.log(data);
        this.count = data.length;
      },
      (err: ErrorApi) => {
        console.log(err.error.message);
        this.count = 0;
      }
    );
  }

  closeNav() {
    this.isHandset$.subscribe(close => {
      if (close) {
        this.sidenav.close();
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
