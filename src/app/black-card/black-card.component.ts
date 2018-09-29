import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-black-card',
  templateUrl: './black-card.component.html',
  styleUrls: ['./black-card.component.scss']
})
export class BlackCardComponent implements OnInit {

  showContent: Boolean = false;


  constructor(
    private route: Router) {

  }

  ngOnInit() {
  }

  backHome() {
    this.route.navigate(['/home']);
  }

  enter() {
    this.showContent = true;
  }

}
