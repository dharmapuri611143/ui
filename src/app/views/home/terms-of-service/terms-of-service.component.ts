import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss'],
  animations: egretAnimations
})
export class TermsOfServiceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
