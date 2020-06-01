import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api-service.service';
import { IOService } from '../../services/io-service.service';
import { UserCameraComponent } from '../user-camera/user-camera.component';
import { DetectFaceResponse } from '../../types/response-detect-face.type';
import { ErrorService } from '../../services/error-service.service';
import { IdentifyResponse } from '../../types/response.type';
import { RegisterComponent } from '../register/register.component';
import { RegisterNewUserResponse } from '../../types/response-register-new-user.type';
import { IdentifyComponent } from '../identify/identify.component';
import { User } from '../../types/user.type';
import { CameraLoadedEvent } from '../../types/camera-loaded-event';
import { Router } from '@angular/router';
import { FaceAttributes } from '../../types/face-attributes';
import { AuthService } from '../../services/auth.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FaceAttributeComponent } from '../face-attribute/face-attribute.component';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})

export class AuthenticateComponent implements AfterViewInit {
  title = 'Authenticate';
  image: Blob;
  imageURL: string;
  cameraOn = true;
  userCamera: UserCameraComponent;
  registerComponent: RegisterComponent;
  identifyComponent: IdentifyComponent;
  identifiedAttrs: FaceAttributes;
  debug = true;


  constructor(
    private api: ApiService,
    private ioService: IOService,
    private errService: ErrorService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }
  ngAfterViewInit(): void {
  }

  onCameraInit(event: any) {
    if (this.debug) {
      console.log(event);
    }
    if (event instanceof (CameraLoadedEvent)) {
      if (event.error === null && event.success !== undefined) {
        // Camera loaded sucessfully
        this.userCamera = event.success;
        // // TODO this.userCamera.MINDENFELE_EVENTEK.subscribe({});
        // // TODO a kamerat ellenorizni hogy engedelyeztek e a legjobb event listenerrel lenne.
      } else {
        // Error happened during camera initialization
        this.errService.handleError(event.error, 'Could not open camera');
        // // TODO itt az alert visszaterese utan ujraproba kene
        return;
      }
      if (this.debug) {
        console.log(this.userCamera);
      }
    }
  }

  // Component initialization events
  onActivate(event: any) {
    if (this.debug) {
      console.log(event);
    }
    if (event instanceof (RegisterComponent)) {
      // Register Component initialized
      this.registerComponent = event;
      this.registerComponent.userRegistered.subscribe((user: User) => {
        if (this.debug) {
          console.log('Registration...');
        }
        this.send(user);
      });
    } else if (event instanceof (IdentifyComponent)) {
      this.identifyComponent = event;
      this.identifyComponent.identifyPressed.subscribe(() => {
        this.identify();
      });
    }
  }


  // Open face attributes in separate dialog box
  displayFaceAttributes(): void {
    if (this.debug) {
      console.log(this.identifiedAttrs);
      console.log(this.imageURL);
    }

    // Check for errors
    if (this.imageURL === '' || this.identifiedAttrs === undefined) {
      return;
    }

    // Open a dialog box with face attributes
    const dialogRef = this.dialog.open(FaceAttributeComponent, {
      width: '500px',
      data: { user: this.identifiedAttrs, picture: this.imageURL }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.debug) {
        console.log('The dialog was closed');
      }
    });
  }

  // Navigate by full URL
  goTo(page: string) {
    this.router.navigateByUrl(page);
  }

  // Identify user after taking picture
  async identify() {
    if (this.userCamera === undefined) {
      return;
    }
    this.image = await this.userCamera.takePhoto();
    if (this.image !== undefined) {
      this.api.detectFace(this.image)
        .subscribe({
          error: error => { this.errService.handleError(error, 'Detect Face Error happened'); },
          next: (ret: DetectFaceResponse[]) => {
            if (ret[0] === undefined) {
              // unsuccessful face detection
              this.errService.handleError(new Error('self-defined'), 'No Face Detected');
              return;
            }
            if (this.debug) {
              console.log(ret[0]);
            }

            // Face detected
            // Save face position and Attributes
            this.identifiedAttrs = new FaceAttributes();
            this.identifiedAttrs.faceAttributes = ret[0].faceAttributes;
            this.identifiedAttrs.faceRectangle = ret[0].faceRectangle;

            // API call (identify recently detected face)
            this.api.identifyFace(ret[0])
              .subscribe({
                error: error => { this.errService.handleError(error, 'Identify Face Error happened'); },
                next: (ret: IdentifyResponse[]) => {
                  if (ret === null) {
                    return;
                  }
                  if (ret.length <= 0){
                    return;
                  }
                  if (ret[0].candidates === null){
                    return;
                  }
                  if (ret[0].candidates.length > 0) {
                    // successfull authentication
                    // @ts-ignore
                    const id = ret[0].candidates[0].personId;
                    if (this.debug) {
                      console.log('Successful authentication of: ' + id);
                    }
                    // Save that user is authenticated
                    const user = this.ioService.readVariable(id);
                    this.authService.login(id, user.name);

                    // Save picture and data
                    URL.revokeObjectURL(this.imageURL);
                    this.imageURL = URL.createObjectURL(this.image);
                    user.image = this.imageURL;
                    user.faceAttributes = this.identifiedAttrs;

                    this.ioService.putVariable(id, user);

                    // Show face attributes
                    this.displayFaceAttributes();

                    // redirect to welcome page
                    this.goTo('welcome/' + id);
                  } else {
                    // no success, try to register or try again
                    if (this.debug) {
                      console.log('Please try again or register');
                    }
                    // Save picture
                    URL.revokeObjectURL(this.imageURL);
                    this.imageURL = URL.createObjectURL(this.image);

                    // Show face attributes
                    this.displayFaceAttributes();

                    // Warn user that identification was unsuccessful
                    const choiceRegister = this.displayUnsuccessfulIdentification();

                    if (choiceRegister) {
                      // show register component
                      this.goTo('authenticate/new');
                    } else {
                      // Stay on this page
                      // Reset camera
                      this.userCamera.videoClicked();
                    }

                  }
                }
              });
          }
        });

    }
  }


  displayUnsuccessfulIdentification() {
    // Warn user that identification was unsuccessful
    const choice = confirm('Identification was not successfull. Do you want to register?');
    return choice;
  }

  // User registration
  async send(user: User) {
    if (this.userCamera === undefined) {
      return;
    }
    this.image = await this.userCamera.takePhoto();
    if (this.debug) {
      console.log('took image: ');
    }
    if (this.image !== undefined) {
      this.api.registerNewUser(user)
        .subscribe({
          error: () => { },
          next: (ret: RegisterNewUserResponse) => {
            // save personID
            user.id = ret.personId;
            this.api.addNewFaceToUser(this.image, user)
              .subscribe({
                error: () => { },
                next: (ret: any) => {
                  // Successfull addition of face
                  if (this.debug) {
                    console.log(ret);
                  }
                  this.api.trainNewUser()
                    .subscribe({
                      error: () => { },
                      next: () => {
                        // success, save data and redirect
                        if (this.debug) {
                          console.log('Successfull registration');
                        }
                        this.authService.login(user.id,
                          user.name);

                        this.ioService.putVariable(this.registerComponent.user.id, this.registerComponent.user);

                        // Reset camera
                        this.userCamera.videoClicked();
                        // Redirect to Authentication
                        this.goTo('authenticate');
                      }
                    });
                }
              });
          }
        });
    }
  }



}

