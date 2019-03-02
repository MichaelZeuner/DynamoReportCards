import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'dynamo-report-cards';
  darkModeActive = false;
  showMenu = false;

  modeToggleSwitch() {
    this.darkModeActive = !this.darkModeActive;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

}
