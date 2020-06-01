import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { IdentifyComponent } from './components/identify/identify.component';
import { UserCameraComponent } from './components/user-camera/user-camera.component';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: 'authenticate', component: AuthenticateComponent,
    children: [
      { path: 'new', component: RegisterComponent},
      { path: '', pathMatch: 'full', component: IdentifyComponent}
    ],
    canDeactivate: [CanDeactivateGuard]
  },
  { path: 'welcome/:id', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
