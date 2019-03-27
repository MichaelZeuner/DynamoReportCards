import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event',
  template: `
    <p>
      event works!
    </p>
  `,
  styles: []
})
export class EventsComponent implements OnInit {

  //maybe take in a level object
  constructor() { }

  ngOnInit() {
  }

}
