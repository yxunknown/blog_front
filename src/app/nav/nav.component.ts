import {Component, Input, OnInit} from '@angular/core';
import {TokenService} from '../services/token.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  user: any;
  isGuest: boolean;
  @Input() index: number;
  constructor(
    private token: TokenService
  ) { }

  ngOnInit() {
    this.user = this.token.getUser();
    this.isGuest = this.token.isGuest();
  }

}
