import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';
import { SelectDialogInput } from '../mat-select-dialog/select-dialog-input';
import { MatSelectDialogComponent } from '../mat-select-dialog/mat-select-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) { }

  openConfirmDialog(msg: string) {
    console.log('About to open confirm');
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg
      }
    });
  }

  openSelectDialog(input: SelectDialogInput) {
    return this.dialog.open(MatSelectDialogComponent, {
      width: '400px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: input
    })
  }

  openSnackBar(message: string, duration: number = 5000) {
    this.snackBar.open(message, 'OK', {
      duration: duration,
    });
  }
}
