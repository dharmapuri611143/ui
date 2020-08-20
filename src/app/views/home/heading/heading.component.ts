
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ApiService } from '../../../shared/services/api.service';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  animations: egretAnimations
})
export class HeadingComponent implements OnInit {
  isHeading = true;
  toHighlight = '';
  slocation: string;
  filterText = new FormControl();
  keyword = 'searchString';
  where: any = [];
  public filteredStates$: Observable<any> = null;
  isLoading = false;
  constructor(private fb: FormBuilder,
    private router: Router,
    private httpClient: HttpClient,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef, private api: ApiService) { }

  lookup(value: any): Observable<any> {
    return this.api.headerSearch(value).pipe(
      map(results => results));
  }
  async ngOnInit() {
    this.filteredStates$ = this.filterText.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value) {
          return this.lookup({ searchString: value });
        } else {
          return this.lookup({});
        }
      })
    );
  }

  selectEvent(item) {
    const query = {};
    if (item) {
      query['filterText'] = item;
    }
    this.router.navigate(['/cust/servicel', query]);
  }

  onFocused(e) {
  }

  submitSearch() {
    let query = {};
    if (this.filterText.value) {
      query['filterText'] = this.filterText.value;
    }
    this.router.navigate(['/cust/servicel', query]);

  }

}