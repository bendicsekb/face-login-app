import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, EventEmitter, Output, Inject } from '@angular/core';
import { FaceAttributes } from '../../types/face-attributes';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  user: FaceAttributes;
  picture: string;
}


@Component({
  selector: 'app-face-attribute',
  templateUrl: './face-attribute.component.html',
  styleUrls: ['./face-attribute.component.css']
})

export class FaceAttributeComponent implements AfterViewInit, OnChanges {
  @ViewChild('image') image: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;
  debug = true;

  constructor(
    public _DomSanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<FaceAttributeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  // Dialog close function
  closeDialog() {
    this.dialogRef.close('Pizza!');
  }
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (this.ctx === undefined) {
      return;
    }
    // Redraw the bounding box of the face on changes
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.ctx.strokeRect(
      this.data.user.faceRectangle.left,
      this.data.user.faceRectangle.top,
      this.data.user.faceRectangle.width,
      this.data.user.faceRectangle.height);
  }

  ngAfterViewInit(): void {
    // Set image source, canvas size to image size
    this.image.nativeElement.src = this.data.picture;
    this.canvas.nativeElement.width = 640;
    this.canvas.nativeElement.height = 480;

    // Draw the bounding box of the face
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.strokeStyle = "#3f51b5";
    this.ctx.lineWidth = 6;
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.ctx.beginPath();
    this.ctx.strokeRect(
      this.data.user.faceRectangle.left,
      this.data.user.faceRectangle.top,
      this.data.user.faceRectangle.width,
      this.data.user.faceRectangle.height);
  }
}
