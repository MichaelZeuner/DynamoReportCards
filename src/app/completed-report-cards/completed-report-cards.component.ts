import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-completed-report-cards',
  templateUrl: './completed-report-cards.component.html',
  styleUrls: ['./completed-report-cards.component.scss']
})
export class CompletedReportCardsComponent implements OnInit {

  constructor(private data: DataService) { }

  ngOnInit() {
  }

}
