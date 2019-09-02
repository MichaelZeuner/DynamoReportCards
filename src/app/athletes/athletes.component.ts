import { Component, OnInit } from '@angular/core';
import { Athlete } from '../interfaces/athlete';
import { DataService } from '../data.service';
import { DialogService } from '../shared/dialog.service';
import { MatInput, MatDatepicker } from '@angular/material';
import { ErrorApi } from '../interfaces/error-api';

@Component({
  selector: 'app-athletes',
  templateUrl: './athletes.component.html',
  styleUrls: ['./athletes.component.scss']
})
export class AthletesComponent implements OnInit {

  public athletes: Athlete[] = [];

  constructor(private data: DataService, private dialog: DialogService) { }

  ngOnInit() {
    this.data.getAthletes().subscribe(
      (data: Athlete[]) => { 
        this.athletes = data; 
        console.log(this.athletes);

        //This is a little hacky, but datetime must be in UTC, so hardcoding the addition of one day
        for(let i=0; i<this.athletes.length; i++) {
          let dob: Date = new Date(new Date(this.athletes[i].date_of_birth).getTime() + 86400000);
          this.athletes[i].date_of_birth = dob.toISOString();
        }
      }
    );
  }

  deleteAthlete(id: number, firstName: string, lastName: string) {
    this.dialog.openConfirmDialog('Are you sure you wish to remove the user "' + firstName + ' ' + lastName + '"?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.data.deleteAthlete(id).subscribe(() => {
          for(let i=0; i<this.athletes.length; i++) {
            const currentAthlete = this.athletes[i];
            if(currentAthlete.id === id) {
              this.dialog.openSnackBar("Athlete deleted!");
              this.athletes.splice(i, 1);
              return;
            }
          }
        });
      }
    });
  }

  createAthlete(firstName: MatInput, lastName: MatInput, dateOfBirthObj: MatDatepicker<Date>, dobInput: MatInput) {
    let dateOfBirth: string = ''; 
    if (dateOfBirthObj._selected != null) { dateOfBirth = dateOfBirthObj._selected.toISOString().split('T')[0]; }

    if(this.checkInput(firstName, lastName, dateOfBirth) === false) { return; }

    let athlete: Athlete = {
      first_name: firstName.value,
      last_name: lastName.value,
      date_of_birth: dateOfBirth
    };

    this.data.addAthlete(athlete).subscribe(
      (data: Athlete) => {
        this.athletes.push(data);
        firstName.value = '';
        lastName.value = '';
        dobInput.value = '';
        this.dialog.openSnackBar('Athlete Created!');
      },
      (error: ErrorApi) => { 
        console.log(error); 
        this.dialog.openSnackBar(error.error.message);
      }
    );
  }

  updateAthlete(id: number, firstName: MatInput, lastName: MatInput, dateOfBirthObj: MatDatepicker<Date>) {
    let dateOfBirth: string = ''; 
    if (dateOfBirthObj._selected != null) { dateOfBirth = dateOfBirthObj._selected.toISOString().split('T')[0]; }

    if(this.checkInput(firstName, lastName, dateOfBirth) === false) { return; }
    let athlete: Athlete = {
      id: id,
      first_name: firstName.value,
      last_name: lastName.value,
      date_of_birth: dateOfBirth
    };

    this.data.putAthlete(athlete).subscribe(
      (data: Athlete) => { 
        console.log(data); 
        this.dialog.openSnackBar('Athlete Updated!');
      },
      (error: ErrorApi) => { 
        console.log(error); 
        this.dialog.openSnackBar(error.error.message);
      }
    );
  }

  checkInput(firstName: MatInput, lastName: MatInput, dateOfBirth: string) {

    if(firstName.value === '') {
      this.dialog.openSnackBar('First Name required!');
      firstName.focus();
      return false;
    }
    if(lastName.value === '') {
      this.dialog.openSnackBar('Last Name required!');
      lastName.focus();
      return false;
    }
    if(dateOfBirth === '' || dateOfBirth === '0000-00-00') {
      this.dialog.openSnackBar('Date of Birth required!');
      return false;
    }
    return true;
  }

}
