import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TokenService} from '../services/token.service';
import {DialogService} from '../services/dialog.service';

import * as $ from 'jquery';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private token: TokenService,
    private dialog: DialogService
  ) {
  }

  ngOnInit() {
    this.dialog.onPositiveClick(() => {
      console.log('????????');
      this.dialog.show('close');
    });
  }

  ngAfterViewInit() {
    if (!this.token.verifyToken()) {
      // show dialog
      // this.dialog.show('show');
    } else {
      // load data
    }
    console.log(this.token.getToken());
  }

  show() {
    this.dialog.show('show');
  }
}
