import { Component, OnInit, ViewChild } from "@angular/core";
import { Athlete } from "../interfaces/athlete";
import { DataService } from "../data.service";
import { DialogService } from "../shared/dialog.service";
import { MatInput, MatDatepicker, PageEvent } from "@angular/material";
import { ErrorApi } from "../interfaces/error-api";
import { MainNavComponent } from "../main-nav/main-nav.component";

@Component({
  selector: "app-athletes",
  templateUrl: "./athletes.component.html",
  styleUrls: ["./athletes.component.scss"]
})
export class AthletesComponent implements OnInit {
  public records: Athlete[] = [];
  @ViewChild("csvReader") csvReader: any;
  public uploadingCsv: Boolean = false;
  public percentageUploaded: number = 0;

  public athletesBase: Athlete[] = [];
  public athletes: Athlete[] = [];
  public athletesDisplayed: Athlete[] = [];
  public pageinatorIndex: number = 0;
  public pageinatorSize: number = 10;

  constructor(
    private data: DataService,
    private dialog: DialogService,
    private nav: MainNavComponent
  ) {}

  ngOnInit() {
    this.nav.displayLoading = true;
    this.data.getAthletes().subscribe((data: Athlete[]) => {
      this.nav.displayLoading = false;
      this.athletesBase = data;
      console.log(this.athletesBase);

      //This is a little hacky, but datetime must be in UTC, so hardcoding the addition of one day
      for (let i = 0; i < this.athletesBase.length; i++) {
        let dob: Date = new Date(
          new Date(this.athletesBase[i].date_of_birth).getTime() + 86400000
        );
        this.athletesBase[i].date_of_birth = dob.toISOString();
      }

      this.athletes = this.athletesBase;
      this.refreshPage();
    });
  }

  deleteAthlete(id: number, firstName: string, lastName: string) {
    this.dialog
      .openConfirmDialog(
        'Are you sure you wish to remove the user "' +
          firstName +
          " " +
          lastName +
          '"?'
      )
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.nav.displayLoading = true;
          this.data.deleteAthlete(id).subscribe(() => {
            this.nav.displayLoading = false;
            for (let i = 0; i < this.athletesBase.length; i++) {
              const currentAthlete = this.athletesBase[i];
              if (currentAthlete.id === id) {
                this.dialog.openSnackBar("Athlete deleted!");
                this.athletesBase.splice(i, 1);
                this.refreshPage();
                return;
              }
            }
          });
        }
      });
  }

  createAthlete(
    firstName: MatInput,
    lastName: MatInput,
    dateOfBirthObj: MatDatepicker<Date>,
    dobInput: MatInput
  ) {
    let dateOfBirth: string = "";
    if (dateOfBirthObj._selected != null) {
      dateOfBirth = dateOfBirthObj._selected.toISOString().split("T")[0];
    }

    if (this.checkInput(firstName, lastName, dateOfBirth) === false) {
      return;
    }

    let athlete: Athlete = {
      first_name: firstName.value,
      last_name: lastName.value,
      date_of_birth: dateOfBirth
    };

    this.nav.displayLoading = true;
    this.data.addAthlete(athlete).subscribe(
      (data: Athlete) => {
        this.nav.displayLoading = false;
        this.athletesBase.push(data);
        firstName.value = "";
        lastName.value = "";
        dobInput.value = "";
        this.dialog.openSnackBar("Athlete Created!");
        this.refreshPage();
      },
      (error: ErrorApi) => {
        console.log(error);
        this.dialog.openSnackBar(error.error.message);
      }
    );
  }

  searchAthletes(firstName: MatInput, lastName: MatInput) {
    if (firstName === null || lastName === null) {
      this.athletes = this.athletesBase;
    } else {
      this.athletes = [];
      for (let i = 0; i < this.athletesBase.length; i++) {
        if (
          this.athletesBase[i].first_name
            .toUpperCase()
            .indexOf(firstName.value.toUpperCase()) > -1 &&
          this.athletesBase[i].last_name
            .toUpperCase()
            .indexOf(lastName.value.toUpperCase()) > -1
        ) {
          this.athletes.push(this.athletesBase[i]);
        }
      }
    }
    this.refreshPage();
  }

  refreshPage() {
    this.pageinatorIndex = 0;
    this.pageChanged(null);
  }

  pageChanged(event: PageEvent) {
    const startingIndex: number =
      event !== null ? event.pageIndex * event.pageSize : 0;
    let endingIndex: number =
      event !== null
        ? (event.pageIndex + 1) * event.pageSize
        : this.pageinatorSize;
    if (endingIndex > this.athletes.length) {
      endingIndex = this.athletes.length;
    }

    this.athletesDisplayed = [];
    for (let i = startingIndex; i < endingIndex; i++) {
      this.athletesDisplayed.push(this.athletes[i]);
    }
  }

  updateAthlete(
    id: number,
    firstName: MatInput,
    lastName: MatInput,
    dateOfBirthObj: MatDatepicker<Date>
  ) {
    let dateOfBirth: string = "";
    if (dateOfBirthObj._selected != null) {
      dateOfBirth = dateOfBirthObj._selected.toISOString().split("T")[0];
    }

    if (this.checkInput(firstName, lastName, dateOfBirth) === false) {
      return;
    }
    let athlete: Athlete = {
      id: id,
      first_name: firstName.value,
      last_name: lastName.value,
      date_of_birth: dateOfBirth
    };

    this.nav.displayLoading = true;
    this.data.putAthlete(athlete).subscribe(
      (data: Athlete) => {
        this.nav.displayLoading = false;
        console.log(data);
        this.dialog.openSnackBar("Athlete Updated!");
      },
      (error: ErrorApi) => {
        console.log(error);
        this.dialog.openSnackBar(error.error.message);
      }
    );
  }

  checkInput(firstName: MatInput, lastName: MatInput, dateOfBirth: string) {
    if (firstName.value === "") {
      this.dialog.openSnackBar("First Name required!");
      firstName.focus();
      return false;
    }
    if (lastName.value === "") {
      this.dialog.openSnackBar("Last Name required!");
      lastName.focus();
      return false;
    }
    if (dateOfBirth === "" || dateOfBirth === "0000-00-00") {
      this.dialog.openSnackBar("Date of Birth required!");
      return false;
    }
    return true;
  }

  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
        console.log(this.records);
      };

      reader.onerror = function() {
        console.log("error is occured while reading file!");
      };
    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(
    csvRecordsArray: any,
    headerLength: any
  ): Athlete[] {
    let csvArr: Athlete[] = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(",");
      if (curruntRecord.length == headerLength) {
        let csvRecord: Athlete = {
          first_name: curruntRecord[0].trim(),
          last_name: curruntRecord[1].trim(),
          date_of_birth: curruntRecord[2].trim()
        };
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(",");
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  uploadAthletes() {
    if (this.records.length === 0) {
      this.dialog.openSnackBar("Please select a CSV file first");
      return;
    }

    this.uploadingCsv = true;
    let counter = 0;
    for (let i = 0; i < this.records.length; i++) {
      this.data
        .addAthleteIfNew(this.records[i])
        .subscribe((inserted: Boolean) => {
          counter++;
          this.percentageUploaded = (counter / this.records.length) * 100;
          console.log("Current Percent: " + this.percentageUploaded);

          if (this.percentageUploaded > 99.5) {
            this.uploadingCsv = false;
          }
        });
    }
  }
}
