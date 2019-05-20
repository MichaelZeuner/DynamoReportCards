import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { DataService } from '../data.service';
import { ReportCardCompleted } from '../interfaces/report-card-completed';
import { PrintableEvent } from '../printable-event';

@Component({
  selector: 'app-print-report-card',
  templateUrl: './print-report-card.component.html',
  styleUrls: ['./print-report-card.component.scss']
})
export class PrintReportCardComponent implements OnInit {
  reportCardIds: string[];
  reportCardDetails: Promise<any>[];
  printableReportCard: PrintableEvent[] = [];
  levels: string[] = [];

  constructor(route: ActivatedRoute, private printService: PrintService, private data: DataService) {
    this.reportCardIds = route.snapshot.params['reportCardIds'].split(',');
  }

  ngOnInit() {
    this.levels.push('level1');
    this.levels.push('level2');
    this.levels.push('level3');
    this.levels.push('level4');
    this.levels.push('level5');
    this.levels.push('level6');

    this.printableReportCard.push({
      name: 'event1',
      skills: [
        {
          levels: [
            {
              name: 'skill1-1',
              rank: 'M'
            },
            {
              name: 'skill2-1',
              rank: ''
            },
            {
              name: 'skill3-1',
              rank: ''
            },
            {
              name: 'skill4-1',
              rank: ''
            },
            {
              name: 'skill5-1',
              rank: ''
            },
            {
              name: 'skill6-1',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-2',
              rank: 'M'
            },
            {
              name: 'skill2-2',
              rank: ''
            },
            {
              name: 'skill3-2',
              rank: ''
            },
            {
              name: 'skill4-2',
              rank: ''
            },
            {
              name: 'skill5-2',
              rank: ''
            },
            {
              name: 'skill6-2',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-3',
              rank: 'M'
            },
            {
              name: 'skill2-3',
              rank: ''
            },
            {
              name: 'skill3-3',
              rank: ''
            },
            {
              name: 'skill4-3',
              rank: ''
            },
            {
              name: 'skill5-3',
              rank: ''
            },
            {
              name: 'skill6-3',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-4',
              rank: 'M'
            },
            {
              name: 'skill2-4',
              rank: ''
            },
            {
              name: 'skill3-4',
              rank: ''
            },
            {
              name: 'skill4-4',
              rank: ''
            },
            {
              name: 'skill5-4',
              rank: ''
            },
            {
              name: 'skill6-4',
              rank: ''
            }
          ]
        }
      ]
    });

    this.printableReportCard.push({
      name: 'event2',
      skills: [
        {
          levels: [
            {
              name: 'skill1-1',
              rank: 'M'
            },
            {
              name: 'skill2-1',
              rank: ''
            },
            {
              name: 'skill3-1',
              rank: ''
            },
            {
              name: 'skill4-1',
              rank: ''
            },
            {
              name: 'skill5-1',
              rank: ''
            },
            {
              name: 'skill6-1',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-2',
              rank: 'M'
            },
            {
              name: 'skill2-2',
              rank: ''
            },
            {
              name: 'skill3-2',
              rank: ''
            },
            {
              name: 'skill4-2',
              rank: ''
            },
            {
              name: 'skill5-2',
              rank: ''
            },
            {
              name: 'skill6-2',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-3',
              rank: 'M'
            },
            {
              name: 'skill2-3',
              rank: ''
            },
            {
              name: 'skill3-3',
              rank: ''
            },
            {
              name: 'skill4-3',
              rank: ''
            },
            {
              name: 'skill5-3',
              rank: ''
            },
            {
              name: 'skill6-3',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-4',
              rank: 'M'
            },
            {
              name: 'skill2-4',
              rank: ''
            },
            {
              name: 'skill3-4',
              rank: ''
            },
            {
              name: 'skill4-4',
              rank: ''
            },
            {
              name: 'skill5-4',
              rank: ''
            },
            {
              name: 'skill6-4',
              rank: ''
            }
          ]
        }
      ]
    });

    this.printableReportCard.push({
      name: 'event3',
      skills: [
        {
          levels: [
            {
              name: 'skill1-1',
              rank: 'M'
            },
            {
              name: 'skill2-1',
              rank: ''
            },
            {
              name: 'skill3-1',
              rank: ''
            },
            {
              name: 'skill4-1',
              rank: ''
            },
            {
              name: 'skill5-1',
              rank: ''
            },
            {
              name: 'skill6-1',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-2',
              rank: 'M'
            },
            {
              name: 'skill2-2',
              rank: ''
            },
            {
              name: 'skill3-2',
              rank: ''
            },
            {
              name: 'skill4-2',
              rank: ''
            },
            {
              name: 'skill5-2',
              rank: ''
            },
            {
              name: 'skill6-2',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-3',
              rank: 'M'
            },
            {
              name: 'skill2-3',
              rank: ''
            },
            {
              name: 'skill3-3',
              rank: ''
            },
            {
              name: 'skill4-3',
              rank: ''
            },
            {
              name: 'skill5-3',
              rank: ''
            },
            {
              name: 'skill6-3',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-4',
              rank: 'M'
            },
            {
              name: 'skill2-4',
              rank: ''
            },
            {
              name: 'skill3-4',
              rank: ''
            },
            {
              name: 'skill4-4',
              rank: ''
            },
            {
              name: 'skill5-4',
              rank: ''
            },
            {
              name: 'skill6-4',
              rank: ''
            }
          ]
        }
      ]
    });

    this.printableReportCard.push({
      name: 'event4',
      skills: [
        {
          levels: [
            {
              name: 'skill1-1',
              rank: 'M'
            },
            {
              name: 'skill2-1',
              rank: ''
            },
            {
              name: 'skill3-1',
              rank: ''
            },
            {
              name: 'skill4-1',
              rank: ''
            },
            {
              name: 'skill5-1',
              rank: ''
            },
            {
              name: 'skill6-1',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-2',
              rank: 'M'
            },
            {
              name: 'skill2-2',
              rank: ''
            },
            {
              name: 'skill3-2',
              rank: ''
            },
            {
              name: 'skill4-2',
              rank: ''
            },
            {
              name: 'skill5-2',
              rank: ''
            },
            {
              name: 'skill6-2',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-3',
              rank: 'M'
            },
            {
              name: 'skill2-3',
              rank: ''
            },
            {
              name: 'skill3-3',
              rank: ''
            },
            {
              name: 'skill4-3',
              rank: ''
            },
            {
              name: 'skill5-3',
              rank: ''
            },
            {
              name: 'skill6-3',
              rank: ''
            }
          ]
        },
        {
          levels: [
            {
              name: 'skill1-4',
              rank: 'M'
            },
            {
              name: 'skill2-4',
              rank: ''
            },
            {
              name: 'skill3-4',
              rank: ''
            },
            {
              name: 'skill4-4',
              rank: ''
            },
            {
              name: 'skill5-4',
              rank: ''
            },
            {
              name: 'skill6-4',
              rank: ''
            }
          ]
        }
      ]
    });

    console.log(this.printableReportCard);

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
