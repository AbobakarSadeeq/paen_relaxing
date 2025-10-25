import { Component, ElementRef, ViewChild } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: []
})

export class Home {

  playSoundBtn = false;
  backgroundImage: string[] = ['/Relaxing-Sounds-images/Rain/rain-img.jpg', '/Relaxing-Sounds-images/Rain/thunderstorm-rain.jpg'];

  ngOnInit(): void {

  }

  playSound() {
    console.log("play sound");
    this.playSoundBtn = true;
  }

  stopSound(): void {
    console.log("stop sound");
    this.playSoundBtn = false;
  }

  removeSound(): void {
    console.log('remove sound');
  }

  // ********************** Add relaxing model sound section **********************

  @ViewChild('AddRelaxingSoundModal') AddRelaxingSoundModalRef!: ElementRef;
  private _bootstrapModalInstance: any;
  isAddRelaxingSoundSelected = false;

  ngAfterViewInit(): void {
    this._bootstrapModalInstance = new bootstrap.Modal(this.AddRelaxingSoundModalRef.nativeElement);
  }

  openAddRelaxingSoundModel(): void {
    console.log("on open relaxing sound model done!");
    this._bootstrapModalInstance.show();

  }

  onCloseRelaxingSoundModel(): void {
    console.log("on close relaxing sound model done!");
    this._bootstrapModalInstance.hide();
  }

  onAddRelaxingSound(): void {
    console.log("on add relaxing sound done!");
    this._bootstrapModalInstance.hide();
  }

  abc(): void {
    console.log("forst");
    this.isAddRelaxingSoundSelected = !this.isAddRelaxingSoundSelected;
  }

}
