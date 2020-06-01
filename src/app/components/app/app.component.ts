import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IOService } from '../../services/io-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'face-login-app';

  constructor() {

  }

}
