import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-html-content-popup',
  templateUrl: './html-content-popup.component.html',
  styleUrls: ['./html-content-popup.component.scss']
})
export class HtmlContentPopupComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<HtmlContentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log(this.data)
  }
onNoClick(): void {
    this.dialogRef.close();
  }
}
