import { ViewChild, ViewChildren, Component, ElementRef, OnInit, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { ImageCapture } from 'image-capture';
import { ErrorService } from 'src/app/services/error-service.service';
import { CameraLoadedEvent } from '../../types/camera-loaded-event';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-user-camera',
    templateUrl: './user-camera.component.html',
    styleUrls: ['./user-camera.component.css']
})

// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
// https://www.w3.org/TR/mediacapture-streams/
// https://www.npmjs.com/package/image-capture

export class UserCameraComponent implements AfterViewInit {
    title: 'Camera';
    stream: MediaStream;
    device: ImageCapture;
    tookPicture: boolean;
    image: Blob;
    @ViewChild('video') video: ElementRef;
    @Output() loaded = new EventEmitter<CameraLoadedEvent>();
    debug = true;
    constructor(private _snackBar: MatSnackBar) {
    }
    ngAfterViewInit(): void {
        this.tookPicture = false;
        this.videoStart();
        this._snackBar.open('Click on video to take picture, click again to discard it.', 'Ok', {
            duration: 5000,
          });
    }

    // Start recording and update image capture device references
    async videoStart() {
        // set up camera stream
        let n = <any>navigator;
        n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
        try {
            this.stream = await n.mediaDevices.getUserMedia({ video: true });

            // make camera stream visible to user
            let video = this.video.nativeElement;
            video.srcObject = this.stream;
            video.play();

            // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Image_Capture_API
            // https://googlechrome.github.io/samples/image-capture/grab-frame-take-photo.html

            // Set up image capture device
            const track = this.stream.getVideoTracks()[0];
            this.device = new ImageCapture(track);

            // Emit event when finished loading
            const ev = new CameraLoadedEvent();
            ev.error = null;
            ev.success = this;
            this.loaded.emit(ev);
        } catch (e) {
            const ev = new CameraLoadedEvent();
            ev.error = e;
            ev.success = undefined;
            this.loaded.emit(ev);
            return;
        }
    }

    // Stop all recording
    videoStop() {
        this.stream.getTracks().forEach(element => {
            element.stop();
        });
    }

    // User clicked on video, either take photo or start recording again
    async videoClicked() {
        if (!this.tookPicture) {
            this.image = await this.device.takePhoto();
            if (this.image !== undefined) {
                this.video.nativeElement.pause();
                this.videoStop();
            }
        } else {
            this.videoStart();
        }
        // Flip boolean
        this.tookPicture = !this.tookPicture;
    }

    // Take photo if not exists already (helper function)
    async takePhoto() {
        if (!this.tookPicture) {
            // No photo exists yet
            await this.videoClicked();
        }
        return this.image;
    }
}
