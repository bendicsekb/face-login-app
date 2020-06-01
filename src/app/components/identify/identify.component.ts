import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-identify',
  templateUrl: './identify.component.html',
  styleUrls: ['./identify.component.css']
})
export class IdentifyComponent implements OnInit {
  @Output() identifyPressed = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  identify(){
    this.identifyPressed.emit('');
  }
}
