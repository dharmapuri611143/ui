import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ApiService } from 'app/shared/services/api.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-free-mat-detail',
  templateUrl: './free-mat-detail.component.html',
  styleUrls: ['./free-mat-detail.component.scss'],
  animations: egretAnimations
})

export class FreeMatDetailComponent implements OnInit {
  itemDetail: any;
  @HostListener('document:keydown.control.c', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    //console.log('copy Performed');
    event.preventDefault();
  }
  @ViewChild('htmlcontent', { static: false }) block: ElementRef;
  constructor(private route: ActivatedRoute,
    private api: ApiService,
    private elRef: ElementRef,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    private cdf: ChangeDetectorRef) { }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.loader.open();
    this.api.freeMatById({ _id: id }).subscribe(res => {
      this.itemDetail = res;
      this.block.nativeElement.innerHTML = res.content;
      let classDiv = document.getElementsByClassName('ql-video') as HTMLCollection;
      for (let i = 0; i < classDiv.length; i++) {
        let di = classDiv[i] as HTMLElement;
        di.style.width = '532px';
        di.style.height = '300px';
      }
      this.loader.close();
      this.cdf.detectChanges();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    })
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }

}
