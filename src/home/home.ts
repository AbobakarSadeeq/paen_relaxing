import { Component, ElementRef, ViewChild } from '@angular/core';
import { HomeService } from './home.service';
// import { HomeService } from './home.service';

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
  categoriesWithItsRelaxingSounds: any[] = [];


  constructor(private _homeService: HomeService) { }

  ngOnInit(): void {
    this._homeService.getAllCategoriesWithRelaxingSounds().subscribe((data: any) => {
      console.log(data);
      this.categoriesWithItsRelaxingSounds = data;
    });
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
  addOnSelectedRelaxingSoundId = 0;
  selectedRelaxingSoundAudioObjInSelections: HTMLAudioElement | null = null;

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
    this.addOnSelectedRelaxingSoundId = 0;
    this.selectedRelaxingSoundAudioObjInSelections?.pause();
  }

  onAddRelaxingSound(): void {
    console.log("on add relaxing sound done!");
    this._bootstrapModalInstance.hide();
    this.addOnSelectedRelaxingSoundId = 0;
    this.selectedRelaxingSoundAudioObjInSelections?.pause();
  }

  selectingRelaxingSoundOnSelectionModel(selectedRelaxingSoundId: number, selectedCategoryIndex: number, selectedRelaxingSoundIndex: number): void {
    if (selectedRelaxingSoundId === this.addOnSelectedRelaxingSoundId) {
      // stop if same selected sound pressed again and also change the selection style as well.
      this.addOnSelectedRelaxingSoundId = 0;
      this.selectedRelaxingSoundAudioObjInSelections?.pause();
    }
    else {
      // change select style effect and change the relaxing sound with it as well.
      this.addOnSelectedRelaxingSoundId = selectedRelaxingSoundId;
      this.selectedRelaxingSoundAudioObjInSelections?.pause();
      this.selectedRelaxingSoundAudioObjInSelections = new Audio(this.categoriesWithItsRelaxingSounds[selectedCategoryIndex].relaxingSounds[selectedRelaxingSoundIndex].soundAudioLocation);
      this.selectedRelaxingSoundAudioObjInSelections.play();
    }

  }

}
