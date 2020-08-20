import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  animations: egretAnimations
})
export class PrivacyPolicyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
