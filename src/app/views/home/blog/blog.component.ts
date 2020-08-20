import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
@Component({
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.scss'],
	animations: egretAnimations
})
export class BlogComponent implements OnInit, OnDestroy, AfterViewInit {
	blogList: any;
	public itemSub: Subscription;
	public getItemSub: Subscription;
	private clientUrl = '';

	constructor(public sanitizer: DomSanitizer,
		private api: ApiService,
		private loader: AppLoaderService,
		private appear: AppConfirmService,
		private changeDetectorRef: ChangeDetectorRef) {
		this.clientUrl = document.location.protocol + '//' + document.location.hostname + ':8080/';
	}
	ngOnInit() {
		this.bloglist();

	}
	ngAfterViewInit() {
		setTimeout(() => {

		}, 0);

	}

	bloglist() {
		this.getItemSub = this.api.blogFetch({})
			.subscribe(data => {
				let dataArray = [];
				for (let item of data) {
					if((item ||{}).image) {
						let path = item.image;
						path = path.substr(16)
						item.image = this.clientUrl + path;
					}
					
					dataArray.push(item);
				}
				this.blogList = dataArray;
				jQuery(function ($) {
					let owl = $('.owl-blog');
					owl.owlCarousel({
						margin: 5,
						loop: true,
						rewind: true,
						nav: false,
						autoplay: true,
						autoplayTimeout: 5000,
						touchDrag: true,
						responsive: {
							0: {
								items: 1
							},
							600: {
								items: 3
							},
							1000: {
								items: 5
							}
						}
					});

					$('.customNextBtn').click(function () {
						owl.trigger('next.owl.carousel');
					});

					$('.customPrevBtn').click(function () {
						owl.trigger('prev.owl.carousel');
					});

				});
				this.changeDetectorRef.detectChanges();
			}, err => {
				this.confirmMsg('Fail', err.error);
			});
	}
	ngOnDestroy() {
		if (this.itemSub) { this.itemSub.unsubscribe(); }
		if (this.getItemSub) { this.getItemSub.unsubscribe(); }
	}
	confirmMsg(title, msg) {
		this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
	}
}
