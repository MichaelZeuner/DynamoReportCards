import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ReportCardSentBack } from '../interfaces/report-card-sent-back';
import { ErrorApi } from '../interfaces/error-api';
import { MainNavComponent } from '../main-nav/main-nav.component';

@Component({
  selector: 'app-sent-back-report-cards',
  templateUrl: './sent-back-report-cards.component.html',
  styleUrls: ['./sent-back-report-cards.component.scss']
})
export class SentBackReportCardsComponent implements OnInit {

  public reportCards: ReportCardSentBack[] = [];

  constructor(private data: DataService, private mainNav: MainNavComponent) { }

  ngOnInit() {
    this.data.getReportCardsSentBack().subscribe(
      (data: ReportCardSentBack[]) => {
        this.reportCards = data;
        console.log(this.reportCards);
      },
      (err: ErrorApi) => {
        console.error(err);
      }
    )
  }

  reportCardSentBack(reportCardSentBack: ReportCardSentBack) {
    console.log('Update the array and the value displayed in the main nav');
    console.log(reportCardSentBack);
    for(let i=0; i< this.reportCards.length; i++) {
      console.log(this.reportCards[i].report_cards_id + ' === ' + reportCardSentBack.report_cards_id);
      if(this.reportCards[i].report_cards_id === reportCardSentBack.report_cards_id) {
        this.reportCards.splice(i, 1);
        this.mainNav.reloadReportCardsSentBack();
        this.mainNav.reloadApprovalNeeded();
        return;
      }
    }
  }

}
