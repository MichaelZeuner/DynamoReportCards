import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { DataService } from '../data.service';
import { ReportCardCompleted } from '../interfaces/report-card-completed';
import { PrintableReportCard } from '../interfaces/printable-report-card';

@Component({
  selector: 'app-print-report-card',
  templateUrl: './print-report-card.component.html',
  styleUrls: ['./print-report-card.component.scss']
})
export class PrintReportCardComponent implements OnInit {
  athleteIds: string[];
  reportCardLoaded: Promise<boolean>;
  printableReportCard: PrintableReportCard;

  constructor(route: ActivatedRoute, private printService: PrintService, private data: DataService) {
    this.athleteIds = route.snapshot.params['athleteIds'].split(',');
  }

  ngOnInit() {
    if(this.athleteIds.length >= 0) {
      this.data.getPrintableReportCard(+this.athleteIds[0]).subscribe(
        (data: PrintableReportCard) => {
          this.printableReportCard = data;
          console.log(data);
          this.printService.onDataReady();
          this.reportCardLoaded = Promise.resolve(true);
        }
      )
    }
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
