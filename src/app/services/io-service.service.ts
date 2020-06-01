import { Injectable } from '@angular/core';
import { User } from '../types/user.type';

@Injectable({ providedIn: 'root' })
export class IOService {
  debug = true;

  // get JSON object of the specified key in the Local Storage
  readVariable(key: string) {
    if (this.debug) {
      console.log('IO Service red element: ');
      console.log(key);
      console.log(JSON.parse(localStorage.getItem(key)));
    }
    return JSON.parse(localStorage.getItem(key));
  }

  // put JSON serialized string object with the specified key in the Local Storage
  putVariable(key: string, value: User) {
    localStorage.setItem(key, JSON.stringify(value));
    if (this.debug) {
      console.log('IO Service placed element: ');
      console.log(key);
      console.log(JSON.parse(localStorage.getItem(key)));
    }
  }

  // remove object of the specified key from the Local Storage
  removeVariable(key: string) {
    localStorage.removeItem(key);
    if (this.debug) {
      console.log('IO Service removed element: ');
      console.log(key);
      console.log(JSON.parse(localStorage.getItem(key)));
    }
  }
}
