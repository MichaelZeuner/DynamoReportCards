import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ReportCard } from '../../interfaces/report-card';
import { DataService } from '../../data.service';
import { MatExpansionPanel } from '@angular/material';
import { ErrorApi } from '../../interfaces/error-api';
import { ReportCardComponent } from '../../interfaces/report-card-component';
import { PrintService } from '../../print.service';
import { ReportCardSentBack } from 'src/app/interfaces/report-card-sent-back';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-report-card-modification-panel',
  templateUrl: './report-card-modification-panel.component.html',
  styleUrls: ['./report-card-modification-panel.component.scss']
})
export class ReportCardModificationPanelComponent implements OnInit {

  @ViewChild('panel') panel: MatExpansionPanel;
  @Input() reportCard: ReportCardSentBack;

  @Output() reportCardSentBackChanged = new EventEmitter<ReportCardSentBack>();
  
  constructor(public printService: PrintService, private data: DataService, private dialog: DialogService) { }

  ngOnInit() {
  }

  generateReportCard(athleteId: number) {
    console.log(athleteId);
    let reportCardData: string[] = [];
    reportCardData.push(athleteId.toString());
    this.printService.printDocument('report-card', reportCardData);
  }

  skillRankChanged(newRank: string, id: number) {
    for(let x=0; x<this.reportCard.components.length; x++) {
      const component = this.reportCard.components[x];
      if(component.report_cards_components_id === id) {
        this.reportCard.components[x].rank = newRank;
      }
    }
  } 

  submitReportCard() {
    this.dialog.openConfirmDialog('Are you sure you wish to resubmit this report card to the supervisor?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.updateReportCard();
      }
    });

  }

  updateReportCard() {
    let sendBackReportCard: any = {
      id: this.reportCard.report_cards_id,
      athletes_id: this.reportCard.athlete.id,
      levels_id: this.reportCard.level.id,
      comment: this.reportCard.comment,
      approved: null,
      status: this.reportCard.status
    }

    console.log('Report Card to Send Back:');
    console.log(sendBackReportCard);

    this.data.putReportCard(sendBackReportCard).subscribe(
      (data: ReportCard) => {
        console.log(data);
        this.updateReportCardComponents();
      },
      (err: ErrorApi) => {
        console.error(err);
      }
    );
  }

  updateReportCardComponents() {
    for(let i=0; i<this.reportCard.components.length; i++) {
      let sendBackReportCardComponent: any = {
        id: this.reportCard.components[i].report_cards_components_id,
        report_cards_id: this.reportCard.report_cards_id,
        skills_id: this.reportCard.components[i].skill.id,
        rank: this.reportCard.components[i].rank
      }

      this.data.putReportCardComponent(sendBackReportCardComponent).subscribe(
        (data: ReportCardComponent) => {
          console.log(data);
        },
        (err: ErrorApi) => {
          console.error(err);
        }
      );
    }

    this.triggerDeleteReportCardMod();
  }

  triggerDeleteReportCardMod() {
    this.data.deleteReportCardMod(this.reportCard.report_cards_mod_id).subscribe(
      (data: any) => {
        console.log(data);
        
        this.dialog.openSnackBar("Report Card Updated and Sent Back!");
        console.log('About to emit reportcard');
        this.reportCardSentBackChanged.emit(this.reportCard);
      },
      (err: ErrorApi) => {
        console.error(err);
      }
    )

    this.triggerDeleteReportCardModComponents();
  }

  triggerDeleteReportCardModComponents() {
    for(let i=0; i<this.reportCard.components.length; i++) {
      if(this.reportCard.components[i].report_cards_mod_components_id != null) {
        this.data.deleteReportCardModComponent(this.reportCard.components[i].report_cards_mod_components_id).subscribe(
          (data: any) => {
            console.log(data);
          },
          (err: ErrorApi) => {
            console.error(err);
          }
        )
      }
    }
  }

}
