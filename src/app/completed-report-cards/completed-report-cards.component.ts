import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ReportCardCompleted } from '../interfaces/report-card-completed';
import { ReportCard } from '../interfaces/report-card';
import { ErrorApi } from '../interfaces/error-api';
import { PrintService } from '../print.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-completed-report-cards',
  templateUrl: './completed-report-cards.component.html',
  styleUrls: ['./completed-report-cards.component.scss']
})
export class CompletedReportCardsComponent implements OnInit {

  public reportCards: ReportCard[] = [];

  constructor(private data: DataService, public printService: PrintService) { }

  ngOnInit() {
    this.data.getReportCardsCompleted().subscribe(
      (data: ReportCardCompleted[]) => {
        this.reportCards = data;
        console.log(this.reportCards);


      },
      (err: ErrorApi) => {

      }
    );
  }

  generateReportCard() {
    console.log("Print it");
    const reportCardIds = ['101', '102'];
    this.printService.printDocument('report-card', reportCardIds);
  }

}
