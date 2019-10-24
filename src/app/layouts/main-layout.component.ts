import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-main-layout",
  template: `
    <app-main-nav>
      <router-outlet></router-outlet>
    </app-main-nav>
  `,
  styles: [""]
})
export class MainLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
