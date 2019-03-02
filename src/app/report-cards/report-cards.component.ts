
import { DataService } from '../data.service';
import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AnimationKeyframesSequenceMetadata } from '@angular/animations';

interface User {
  id: number,
  avatar: string,
  first_name: string,
  last_name: string  
}

interface Api {
  data: User[],
  page: number,
  per_page: number,
  total: number,
  total_pages: number
}

interface Level {
  name: string,
  events: Event[]
}

interface Event {
  name: string,
  skills: Skill[]
}

interface Skill {
  name: string,
  rank: string
}

@Component({
  selector: 'app-report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.scss']
})

export class ReportCardsComponent implements OnInit {

  myControl = new FormControl();
  athletes: string[] = [];
  filteredAthletes: Observable<string[]>;

  apiValue: Api;
  levels: Level[];
  level: string;

  constructor(private data: DataService) { }

  ngOnInit() {

    this.data.getLevels().subscribe((data : Level[]) => {
      console.log(data);

      this.levels = data;
      console.log(this.levels[0].name);
      this.level = this.levels[0].name;
    });

    this.data.getUsers().subscribe((data : Api) => {
      this.apiValue = data;
      for(let i=0; i<this.apiValue.data.length;i++) {
        this.athletes.push(this.apiValue.data[i].first_name + ' ' + this.apiValue.data[i].last_name);
      }

      this.filteredAthletes = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.athletes.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  submitForApproval() {
    console.log("SUBMITTED");
  }

}
