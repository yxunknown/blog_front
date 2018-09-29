import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
  detail() {
    this.route.navigate(['/album', 1]);
  }
}
