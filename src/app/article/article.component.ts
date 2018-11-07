import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import marked from 'marked';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, AfterViewInit {

  @Input() article: any;
  @ViewChild('articleContainer') container: ElementRef;
  @ViewChild('btnShowAll') btnShowAll: ElementRef;
  isShowingAllContent: boolean;
  constructor() { }

  ngOnInit() {
    this.isShowingAllContent = false;
  }
  ngAfterViewInit() {
    this.container.nativeElement.innerHTML = marked(this.article.content);
  }
  showAllContent() {
    if (!this.isShowingAllContent) {
      this.container.nativeElement.style.height = '100%';
      this.btnShowAll.nativeElement.innerText = '收起全文';
      this.isShowingAllContent = true;
    } else {
      this.container.nativeElement.style.height = '100px';
      this.btnShowAll.nativeElement.innerText = '展开全文';
      this.isShowingAllContent = false;
    }
  }

}
