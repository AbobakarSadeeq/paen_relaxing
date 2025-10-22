import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  playSoundBtn = false;

  playSound() {
    console.log("asdfg");
    this.playSoundBtn = true;
  }

  stopSound():void {
    console.log("zxcv");
    this.playSoundBtn = false;


  }
}
