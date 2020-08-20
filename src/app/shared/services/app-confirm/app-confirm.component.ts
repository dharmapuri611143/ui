import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  template: `
  <h1 matDialogTitle *ngIf="data.title==='Success'" style="color: #00c851;">{{data.title}}</h1>
  <h1 matDialogTitle *ngIf="data.title==='Validation'" style="color: #ffc107;">{{data.title}}</h1>
  <h1 matDialogTitle *ngIf="data.title==='Confirm'" style="color: #ffc107;">{{data.title}}</h1>
  <h1 matDialogTitle *ngIf="data.title==='Fail'" style="color: #ce0012;">{{data.title}}</h1>
  <div mat-dialog-content>{{ data.message }}</div>
  <div mat-dialog-actions>
  <button 
  *ngIf="data.button !== 'close'"
  type="button" 
  mat-raised-button
  color="primary" 
  (click)="dialogRef.close(true)">OK</button>
  &nbsp;
  <span fxFlex></span>
  <button 
  type="button"
  color="accent"
  mat-raised-button 
  (click)="dialogRef.close(false)">{{(data.button === 'close') ? 'Close' : 'Cancel'}}</button>
  </div>`,
})
export class AppComfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<AppComfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}