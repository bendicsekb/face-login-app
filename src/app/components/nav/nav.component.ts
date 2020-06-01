import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { IOService } from '../../services/io-service.service';
import { throwMatDuplicatedDrawerError } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  @ViewChild('drawer') navDrawer;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public authService: AuthService, private ioService: IOService) { }
  isLoggedIn() {
    return this.authService.isLoggedIn;
  }
  getUserName() {
    return this.ioService.readVariable(this.authService.id);
  }

  close() {
    this.isHandset$.subscribe((yes: boolean) => {
      if (yes) {
        this.navDrawer.toggle();
      }
    });
  }

  getId() {
    return this.authService.id;
  }
}
