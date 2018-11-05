import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private subject = new Subject<any>();

  constructor() {
  }

  show(msg: {
    type: string,
    title: string,
    content: string
  }) {
    this.subject.next(msg);
  }

  subscribe(callback: (type, title, content) => void) {
    this.subject.asObservable().subscribe({
      next: value => {
        callback(value.type, value.title, value.content);
      }
    });
  }
}
