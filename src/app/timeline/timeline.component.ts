import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit {

  @Input() time: string;
  @Input() cards: any;
  id: number;
  isExtend: boolean;
  addText: string;

  minHeight: number;
  maxHeight: number;

  @ViewChild('cardContainer') cardContainer: ElementRef;
  constructor() {
    this.id = Math.round(Math.random() * 10000);
    this.isExtend = true;
    this.addText = '-';
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    const timeline = document.getElementById(`${this.id}`);
    this.maxHeight = this.cardContainer.nativeElement.clientHeight;
    this.minHeight = 50;
    timeline.style.height = `${this.maxHeight}px`;
  }

  hide() {
    const timeline = document.getElementById(`${this.id}`);
    if (this.isExtend) {
      this.isExtend = false;
      this.addText = '+';
      timeline.style.height = `${this.minHeight}px`;
    } else {
      this.isExtend = true;
      this.addText = '-';
      timeline.style.height = `${this.maxHeight}px`;
    }
  }

  getContent(card) {
    return JSON.parse(card).content;
  }

  getUrl(card) {
    return JSON.parse(card).url;
  }
}
