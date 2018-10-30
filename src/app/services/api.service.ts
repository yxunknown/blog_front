import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {
  }

  tokoen() {
    return 'http://132.232.36.151:8089/api/login-service/login/token';
  }
}
