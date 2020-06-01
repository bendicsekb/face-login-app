import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../types/user.type';
import { ApiService } from '../../services/api-service.service';
import { RegisterNewUserResponse } from '../../types/response-register-new-user.type';
import { IOService } from '../../services/io-service.service';
import { UserCameraComponent } from '../user-camera/user-camera.component';
import { AddFaceResponse } from '../../types/response-add-face.type';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  title = 'Register';
  public user: User;
  @Output() userRegistered = new EventEmitter<User>();

  constructor() {
  }
  onKeyName(event){
    this.user.name = event.target.value;
  }
  onKeyData(event){
    this.user.data = event.target.value;
  }

  send(){
    this.userRegistered.emit(this.user);
  }

  ngOnInit(): void {
    this.user = new User();
    this.user.name = 'Your Name';
    this.user.data = 'Additional data';
  }

}
