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
export class EventComponent implements OnInit {

  //maybe take in a level object
  constructor() { }

  ngOnInit() {
  }

}
