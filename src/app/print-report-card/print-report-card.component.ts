import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { DataService } from '../data.service';
import { ReportCardCompleted } from '../interfaces/report-card-completed';

@Component({
  selector: 'app-print-report-card',
  templateUrl: './print-report-card.component.html',
  styleUrls: ['./print-report-card.component.scss']
})
export class PrintReportCardComponent implements OnInit {
  reportCardIds: string[];
  reportCardDetails: Promise<any>[];

  constructor(route: ActivatedRoute, private printService: PrintService, private data: DataService) {
    this.reportCardIds = route.snapshot.params['reportCardIds'].split(',');
  }

  ngOnInit() {
    this.reportCardDetails = this.reportCardIds
      .map(id => this.getReportCardDetails(id));

    Promise.all(this.reportCardDetails)
      .then(() => {
        console.log(this.reportCardDetails);
        this.printService.onDataReady()
      });
  }

  getReportCardDetails(reportCardId) {
    console.log("getting data for: " +reportCardId);
    return new Promise(resolve => {
        console.log('starting promis');
        this.data.getReportCardDetails(reportCardId).subscribe(
          (reportCardDetails: ReportCardCompleted) => {
            console.log(reportCardDetails[0]);
            resolve(reportCardDetails[0]);
          }
        );
      }
    );
  }
}
