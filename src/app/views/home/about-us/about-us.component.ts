import { Component, OnInit } from '@angular/core';
import { egretAnimations } from '../../../shared/animations/egret-animations';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  animations: egretAnimations
})
export class AboutUsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
