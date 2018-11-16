import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss']
})
export class TodayComponent implements OnInit, AfterViewInit {

  totalTime: number;
  progress: number;
  nowTime: number;
  thisYear: Date;
  currentDate: Date;

  constructor() {
  }

  ngOnInit() {
    this.currentDate = new Date();
    const nextYear = new Date(this.currentDate.getFullYear() + 1, 0, 1, 0, 0, 0);
    this.thisYear = new Date(this.currentDate.getFullYear(), 0, 1, 0, 0, 0);
    this.totalTime = nextYear.getTime() - this.thisYear.getTime();
    this.nowTime = this.currentDate.getTime() - this.thisYear.getTime();
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.nowTime = new Date().getTime() - this.thisYear.getTime();
      const yp = document.getElementById('y-progress');
      yp.style.width = `${this.nowTime * 100 / this.totalTime}%`;
    }, 1000);
  }
}
