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

  birthDate = new Date(1994, 8, 11, 0, 0, 0);
  deadDate = new Date(2064, 8, 11, 0, 0, 0);

  totalLife = this.deadDate.getTime() - this.birthDate.getTime();
  nowLife: number;

  constructor() {
  }

  ngOnInit() {
    this.currentDate = new Date();
    const nextYear = new Date(this.currentDate.getFullYear() + 1, 0, 1, 0, 0, 0);
    this.thisYear = new Date(this.currentDate.getFullYear(), 0, 1, 0, 0, 0);
    this.totalTime = nextYear.getTime() - this.thisYear.getTime();
    this.nowTime = this.currentDate.getTime() - this.thisYear.getTime();
    this.nowLife = this.currentDate.getTime() - this.birthDate.getTime();
  }

  ngAfterViewInit() {
    setInterval(() => {
      const d = new Date();
      this.nowTime = d.getTime() - this.thisYear.getTime();
      const yp = document.getElementById('y-progress');
      yp.style.width = `${this.nowTime * 100 / this.totalTime}%`;
      this.nowLife = d.getTime() - this.birthDate.getTime();
      const lifeProgress = document.getElementById('life-progress');
      lifeProgress.style.width = `${this.nowLife * 100 / this.totalLife}%`;
    }, 1000);
  }
}
