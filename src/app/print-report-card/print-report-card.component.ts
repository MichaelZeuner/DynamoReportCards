import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PrintService } from "../print.service";
import { DataService } from "../data.service";
import { ReportCardCompleted } from "../interfaces/report-card-completed";
import { PrintableReportCard } from "../interfaces/printable-report-card";
import { ErrorApi } from "../interfaces/error-api";
import { DialogService } from "../shared/dialog.service";

@Component({
  selector: "app-print-report-card",
  templateUrl: "./print-report-card.component.html",
  styleUrls: ["./print-report-card.component.scss"]
})
export class PrintReportCardComponent implements OnInit {
  printData: string[];
  reportCardLoaded: Promise<boolean>;
  printableReportCard: PrintableReportCard;
  levelBase: string;

  constructor(
    route: ActivatedRoute,
    private printService: PrintService,
    private data: DataService,
    private dialog: DialogService
  ) {
    console.log(route.snapshot.params);
    this.printData = route.snapshot.params["printData"].split(",");
    console.log(this.printData);
  }

  ngOnInit() {
    if (this.printData.length >= 0) {
      this.data
        .getPrintableReportCard(+this.printData[0], +this.printData[1])
        .subscribe(
          (data: PrintableReportCard) => {
            console.log(data);

            this.printableReportCard = data;
            this.levelBase = this.printableReportCard.levels[0].name
              .split(" ")[0]
              .toUpperCase();
            this.printService.onDataReady();
            this.reportCardLoaded = Promise.resolve(true);
          },
          (err: ErrorApi) => {
            console.error(err);
            this.dialog.openSnackBar("No previous report cards found...");
          }
        );
    }
  }

  getReportCardDetails(reportCardId) {
    console.log("getting data for: " + reportCardId);
    return new Promise(resolve => {
      console.log("starting promis");
      this.data
        .getReportCardDetails(reportCardId)
        .subscribe((reportCardDetails: ReportCardCompleted) => {
          console.log(reportCardDetails[0]);
          resolve(reportCardDetails[0]);
        });
    });
  }
}
