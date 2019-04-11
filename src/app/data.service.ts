import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Level } from './interfaces/level';
import { ReportCard } from './interfaces/report-card';
import { AuthService } from './auth/auth.service';
import { ReportCardComponent } from './interfaces/report-card-component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAthletes() {
    return this.http.get(this.baseUrl + '/athletes');
  }

  getLevelEvents(levelId: number) {
    return this.http.get(this.baseUrl + `/level-events/${levelId}`);
  }

  getEventSkills(levelId: number, eventId: number) {
    return this.http.get(this.baseUrl + `/level-event-skills/${levelId}/${eventId}`);
  }

  getLevels() {
    return this.http.get(this.baseUrl + '/levels');
  }

  addReportCard(reportCard: ReportCard) {
    return this.http.post(this.baseUrl + '/report-cards', reportCard);
  }

  putReportCard(reportCard: ReportCard) {
    return this.http.put(this.baseUrl + '/report-cards/' + reportCard.id, reportCard);
  }

  addReportCardComponent(reportCardComponent: ReportCardComponent) {
    return this.http.post(this.baseUrl + '/report-cards-components', reportCardComponent);
  }

  putReportCardComponent(reportCardComponent: ReportCardComponent) {
    return this.http.put(this.baseUrl + '/report-cards-components/' + reportCardComponent.id, reportCardComponent);
  }

  getReportCardsNeedingApproval() {
    return this.http.get(this.baseUrl + '/report-cards-requiring-approval');
  }
}
