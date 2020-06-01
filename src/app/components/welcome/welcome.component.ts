import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../types/user.type';
import { IOService } from '../../services/io-service.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  user: User;
  @ViewChild('canvas') canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;
  @ViewChild('image') image: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private ioService: IOService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.user = new User();
    this.route.params.subscribe(params => {
      const savedUser: User = this.ioService.readVariable(params.id);
      if (savedUser === null || savedUser === undefined || savedUser.data === undefined || savedUser.faceAttributes === undefined) {
        this.logOut();
        return;
      } else {
        this.user = savedUser;
      }
    });
  }

  // Log out and redirect
  logOut() {
    const id = this.authService.id;
    this.authService.logout();
    this.router.navigateByUrl('');
    const user = this.ioService.readVariable(id);
    URL.revokeObjectURL(user.image);
    user.image = '';
    this.ioService.putVariable(id, user);
  }

}
