import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getAthletes() {
    return this.http.get('http://localhost:8080/api/athletes');
  }

  getLevels() {
    return this.http.get('http://localhost:8080/api/levels');
  }
}
