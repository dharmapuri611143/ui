import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-our-service',
  templateUrl: './our-service.component.html',
  styleUrls: ['./our-service.component.scss'],
  animations: egretAnimations
})
export class OurServiceComponent implements OnInit, OnDestroy {

  constructor(private router: Router, 
    private api: ApiService,
    public sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    
  }

}
