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

  choseCover() {
    const coverInput = document.getElementById('cover-chose');
    coverInput.click();
  }
  fileChange() {
    const fileObj = document.getElementById('cover-chose');
    const file = (fileObj as any).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', function () {
      const img = document.getElementById('cover-previewer');
      img.setAttribute('src', reader.result);
    });
  }
}
