import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  playSoundBtn = false;
  backgroundImage: string = 'rain-img.jpg' // ../../public/rain-img.jpg and rain-img.jpg are same

  playSound() {
    console.log("asdfg");
    this.playSoundBtn = true;
  }

  stopSound(): void {
    console.log("zxcv");
    this.playSoundBtn = false;
  }

  addRelaxingSound(): void {
    console.log("not yet!");
  }
}
