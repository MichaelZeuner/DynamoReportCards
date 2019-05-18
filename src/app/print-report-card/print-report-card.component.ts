import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';

@Component({
  selector: 'app-print-report-card',
  templateUrl: './print-report-card.component.html',
  styleUrls: ['./print-report-card.component.scss']
})
export class PrintReportCardComponent implements OnInit {
  reportCardIds: string[];
  reportCardDetails: Promise<any>[];

  constructor(route: ActivatedRoute, private printService: PrintService) {
    this.reportCardIds = route.snapshot.params['reportCardIds'].split(',');
  }

  ngOnInit() {
    this.reportCardDetails = this.reportCardIds
      .map(id => this.getReportCardDetails(id));
    Promise.all(this.reportCardDetails)
      .then(() => this.printService.onDataReady());
  }

  getReportCardDetails(reportCardId) {
    const amount = Math.floor((Math.random() * 100));
    return new Promise(resolve =>
      setTimeout(() => resolve({amount}), 1000)
    );
  }
}
