import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TokenService} from '../services/token.service';
import {DialogService} from '../services/dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private token: TokenService,
    private dialog: DialogService
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (!this.token.verifyToken()) {
      // show dialog
      // this.dialog.show('show');
    } else {
      // load data
    }
  }

  show() {
    this.dialog.show('show');
  }
}
