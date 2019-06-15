import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SelectDialogInput } from './select-dialog-input';

@Component({
  selector: 'app-mat-select-dialog',
  templateUrl: './mat-select-dialog.component.html',
  styleUrls: ['./mat-select-dialog.component.scss']
})
export class MatSelectDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: SelectDialogInput,
    public dialogRef: MatDialogRef<MatSelectDialogComponent>) { }

  ngOnInit() { }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
