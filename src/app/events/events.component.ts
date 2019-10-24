import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { DialogService } from "../shared/dialog.service";
import { MatInput } from "@angular/material";
import { Event } from "../interfaces/event";
import { ErrorApi } from "../interfaces/error-api";
import { MainNavComponent } from "../main-nav/main-nav.component";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"]
})
export class EventsComponent implements OnInit {
  public events: Event[] = [];

  constructor(
    private data: DataService,
    private dialog: DialogService,
    private nav: MainNavComponent
  ) {}

  ngOnInit() {
    this.nav.displayLoading = true;
    this.data.getEvents().subscribe((events: Event[]) => {
      this.nav.displayLoading = false;
      this.events = events;
      console.log(this.events);
    });
  }

  deleteEvent(eventToRemove: Event) {
    this.dialog
      .openConfirmDialog(
        'Are you sure you wish to remove the event "' +
          eventToRemove.name +
          '"?'
      )
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.nav.displayLoading = true;
          this.data.deleteEvent(eventToRemove).subscribe(() => {
            this.nav.displayLoading = false;
            for (let i = 0; i < this.events.length; i++) {
              let event = this.events[i];
              if (event.id === eventToRemove.id) {
                this.events.splice(i, 1);
                this.dialog.openSnackBar("Event Deleted!");
                return;
              }
            }
          });
        }
      });
  }

  addEvent(newEvent: MatInput) {
    const event: Event = {
      name: newEvent.value
    };

    this.nav.displayLoading = true;
    this.data.addEvent(event).subscribe(
      (data: Event) => {
        this.nav.displayLoading = false;
        this.dialog.openSnackBar(data.name + " has been added!");
        this.events.push(data);
        newEvent.value = "";
      },
      (error: ErrorApi) => {
        console.log(error);
      }
    );
  }

  eventChanged(event: Event, newName: string) {
    event.name = newName;

    console.log(event);
    this.nav.displayLoading = true;
    this.data.putEvent(event).subscribe((data: Event) => {
      this.nav.displayLoading = false;
      this.dialog.openSnackBar("Event Updated!", 3000);
      console.log(data);
    });
  }
}
