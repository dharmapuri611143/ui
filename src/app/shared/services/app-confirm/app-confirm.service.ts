import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

import { AppComfirmComponent } from './app-confirm.component';

interface confirmData {
  title?: string,
  message?: string,
  button?: string
}

@Injectable()
export class AppConfirmService {
  constructor(private dialog: MatDialog) { }
  public confirm(data: confirmData = {}): Observable<boolean> {
    data.title = data.title || 'Confirm';
    data.message = data.message || 'Are you sure?';
    data.button = data.button || '';
    let dialogRef: MatDialogRef<AppComfirmComponent>;
    dialogRef = this.dialog.open(AppComfirmComponent, {
      width: '380px',
      disableClose: true,
      data: {title: data.title, message: data.message, button: data.button}
    });
    return dialogRef.afterClosed();
  }
}
