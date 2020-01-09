import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { DataService } from '../data.service';
import { DialogService } from '../shared/dialog.service';
import { TestingSheet } from '../interfaces/testing-sheet';
import { Level } from '../interfaces/level';
import { Athlete } from '../interfaces/athlete';

interface PageData {
  levels: Level[];
  athletes: Athlete[];
  events: Event[];
}

@Component({
  selector: 'app-print-testing-sheet',
  templateUrl: './print-testing-sheet.component.html',
  styleUrls: ['./print-testing-sheet.component.scss']
})
export class PrintTestingSheetComponent implements OnInit {


  testingSheetLoaded: Promise<boolean>;
  test: any[] = [];
  

  testPages: any[] = [];
  pageHtml: string[] = [];

  constructor(
    route: ActivatedRoute,
    private printService: PrintService,
    private data: DataService) { 
      console.log(route.snapshot.params["testData"]);
      this.test = JSON.parse(route.snapshot.params["testData"]);
    }

  ngOnInit() {
    console.log(this.test);
    this.data.getTestingSheetData(this.test).subscribe((data: any[]) => {
      let curPage = 0;
      const LEVELS_PER_PAGE = 6;
      console.log("data:", data);
      /*for(let i=0; i<data.length; i++) {
        
        for(let y=0; y<data[i].levels.length; y++) {
          if(this.testPages[curPage] === null || typeof this.testPages[curPage] == 'undefined') {
            this.testPages[curPage] = {
              levels: [],
              athletes: [],
              events: []
            }
          } 
          if (this.testPages[curPage].levels.length < LEVELS_PER_PAGE) {
            this.testPages[curPage].levels.push(data[i].levels[y]);
          } else {
            console.log("Increment curPage: " + curPage + " and decrememnt y: " + y);
            curPage++;
            y--;
          }
        }
        this.testPages[curPage].athletes.push(data[i].athlete);
      }

      console.log(this.testPages);*/
      this.testPages = data;


      this.printService.onDataReady();
      this.testingSheetLoaded = Promise.resolve(true);
    });

  }

}
