import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss'],
  animations: egretAnimations
})
export class DisclaimerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
