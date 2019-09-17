import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Level } from "./interfaces/level";
import { ReportCard } from "./interfaces/report-card";
import { AuthService } from "./auth/auth.service";
import { ReportCardComponent } from "./interfaces/report-card-component";
import { Skill } from "./interfaces/skill";
import { ReportCardSkill } from "./interfaces/report-card-skill";
import { Event } from "./interfaces/event";
import { User } from "./interfaces/user";
import { LevelGroups } from "./interfaces/level-groups";
import { ReportCardMod } from "./interfaces/report-card-mod";
import { ReportCardModComponent } from "./interfaces/report-card-mod-component";
import { Athlete } from "./interfaces/athlete";
import { Comments } from "./interfaces/comments";
import { ReportCardComments } from "./interfaces/report-card-comments";

@Injectable({
  providedIn: "root"
})
export class DataService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers() {
    return this.http.get(this.baseUrl + "/users");
  }

  putUser(user: User) {
    if (user.password === "") {
      return this.http.put(
        this.baseUrl + "/update-user-no-password/" + user.id,
        user
      );
    } else {
      return this.http.put(this.baseUrl + "/users/" + user.id, user);
    }
  }

  addUser(user: User) {
    return this.http.post(this.baseUrl + "/users", user);
  }

  deleteUser(id: number) {
    return this.http.delete(this.baseUrl + "/users/" + id);
  }

  getAthletes() {
    return this.http.get(this.baseUrl + "/athletes");
  }

  addAthlete(athlete: Athlete) {
    return this.http.post(this.baseUrl + "/athletes", athlete);
  }

  putAthlete(athlete: Athlete) {
    return this.http.put(this.baseUrl + "/athletes/" + athlete.id, athlete);
  }

  deleteAthlete(id: number) {
    return this.http.delete(this.baseUrl + "/athletes/" + id);
  }

  getLevelEvents(levelId: number) {
    return this.http.get(this.baseUrl + `/level-events/${levelId}`);
  }

  getEventSkills(levelId: number, eventId: number) {
    return this.http.get(
      this.baseUrl + `/level-event-skills/${levelId}/${eventId}`
    );
  }

  getLevelGroups() {
    return this.http.get(this.baseUrl + "/level-groups");
  }

  putLevelGroup(levelGroup: LevelGroups) {
    return this.http.put(
      this.baseUrl + "/level-groups/" + levelGroup.id,
      levelGroup
    );
  }

  addLevelGroup(levelGroup: LevelGroups) {
    return this.http.post(this.baseUrl + "/level-groups", levelGroup);
  }
  deleteLevelGroup(levelGroup: LevelGroups) {
    return this.http.delete(this.baseUrl + "/level-groups/" + levelGroup.id);
  }

  getLevels() {
    return this.http.get(this.baseUrl + "/read-levels");
  }

  putLevel(level: Level) {
    return this.http.put(this.baseUrl + "/levels/" + level.id, level);
  }

  addLevel(level: Level) {
    return this.http.post(this.baseUrl + "/levels", level);
  }

  deleteLevel(level: Level) {
    return this.http.delete(this.baseUrl + "/levels/" + level.id);
  }

  getEvents() {
    return this.http.get(this.baseUrl + "/events");
  }

  addEvent(event: Event) {
    return this.http.post(this.baseUrl + "/events", event);
  }

  deleteEvent(event: Event) {
    return this.http.delete(this.baseUrl + "/events/" + event.id);
  }

  putEvent(event: Event) {
    return this.http.put(this.baseUrl + "/events/" + event.id, event);
  }

  addSkill(skill: ReportCardSkill) {
    return this.http.post(this.baseUrl + "/skills", skill);
  }

  putSkill(skill: ReportCardSkill) {
    return this.http.put(this.baseUrl + "/skills/" + skill.id, skill);
  }

  deleteSkill(skill: Skill) {
    return this.http.delete(this.baseUrl + "/skills/" + skill.id);
  }

  getAthletesRecentReportCards(athleteId: number) {
    return this.http.get(
      this.baseUrl + "/get-athletes-recent-report-cards/" + athleteId
    );
  }

  getComments() {
    return this.http.get(this.baseUrl + "/get-comments");
  }

  putComment(comment: Comments) {
    return this.http.put(this.baseUrl + "/put-comments", comment);
  }

  addComment(comment: Comments) {
    return this.http.post(this.baseUrl + "/add-comments", comment);
  }

  addReportCardComment(reportCardComment: ReportCardComments) {
    return this.http.post(
      this.baseUrl + "/report-cards-comments",
      reportCardComment
    );
  }

  addReportCard(reportCard: ReportCard) {
    return this.http.post(this.baseUrl + "/report-cards", reportCard);
  }

  putReportCard(reportCard: ReportCard) {
    return this.http.put(
      this.baseUrl + "/report-cards/" + reportCard.id,
      reportCard
    );
  }

  addReportCardComponent(reportCardComponent: ReportCardComponent) {
    return this.http.post(
      this.baseUrl + "/report-cards-components",
      reportCardComponent
    );
  }

  putReportCardComponent(reportCardComponent: ReportCardComponent) {
    return this.http.put(
      this.baseUrl + "/report-cards-components/" + reportCardComponent.id,
      reportCardComponent
    );
  }

  addReportCardMod(reportCardMod: ReportCardMod) {
    return this.http.post(this.baseUrl + "/report-card-mod", reportCardMod);
  }

  deleteReportCardMod(reportCardModId: number) {
    return this.http.delete(
      this.baseUrl + "/report-card-mod/" + reportCardModId
    );
  }

  addReportCardModComponent(reportCardModComponent: ReportCardModComponent) {
    return this.http.post(
      this.baseUrl + "/report-card-mod-components",
      reportCardModComponent
    );
  }

  deleteReportCardModComponent(reportCardModComponentId: number) {
    return this.http.delete(
      this.baseUrl + "/report-card-mod-components/" + reportCardModComponentId
    );
  }

  getReportCardDetails(reportCardId: number) {
    return this.http.get(
      this.baseUrl + "/report-cards-components-for-report-card/" + reportCardId
    );
  }

  getReportCardsSentBack() {
    return this.http.get(
      this.baseUrl + "/report-cards-sent-back/" + this.authService.user.id
    );
  }

  getReportCardsNeedingApproval() {
    return this.http.get(this.baseUrl + "/report-cards-requiring-approval");
  }

  getAthletesAttemptsAtLevel(athleteId: number, reportCardId: number) {
    return this.http.get(
      this.baseUrl +
        "/athletes-attempts-at-level/" +
        athleteId +
        "/" +
        reportCardId
    );
  }

  getReportCardsCompleted() {
    return this.http.get(
      this.baseUrl + "/report-cards-completed/" + this.authService.user.id
    );
  }

  getPrintableReportCard(athleteId: number) {
    return this.http.get(this.baseUrl + "/printable-report-card/" + athleteId);
  }
}
