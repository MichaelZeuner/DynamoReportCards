import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAthletes() {
    return this.http.get(this.baseUrl + '/athletes');
  }

  putSkill(id: number) {
  }

  getSkills() {
    
  }

  getLevels() {
    return this.http.get(this.baseUrl + '/levels');
  }
}
